/* eslint-disable @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any */
import Axios, {
    AxiosError,
    AxiosInstance,
    AxiosPromise,
    AxiosRequestConfig,
    AxiosResponse,
    CancelTokenSource,
} from 'axios';
import { Observable, ObservableInput, of, retry } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { getReqIdFromPino } from '../../utils/pino.util';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from '../../constants/system.constant';
import { LogLevels } from '../../common/enums/log-levels.enum';

type AxiosRequestMeta = {
    meta: {
        requestStartTime: number;
    };
};

const defaultRetryConfig = {
    count: 3,
    delayMultiplier: 200,
};

@Injectable()
export class HttpService {
    private readonly _instance: AxiosInstance = Axios.create({});
    private readonly _logger: Logger = new Logger(HttpService.name);

    constructor(private readonly _configService: ConfigService) {
        // Interceptors to add requestId to outgoing requests and to log the response times
        this._instance.interceptors.request.use(
            (config: AxiosRequestConfig & AxiosRequestMeta) => {
                const reqId = getReqIdFromPino();
                config.meta = {
                    requestStartTime: Date.now(),
                };
                config.headers['x-request-id'] = reqId;
                return config;
            },
        );
        this._instance.interceptors.response.use(
            (response: AxiosResponse & { config: AxiosRequestMeta }) => {
                this._logRequestCall(response);
                return response;
            },
            async (
                error: AxiosError & { response: { config: AxiosRequestMeta } },
            ) => {
                this._logRequestError(error);
                return Promise.reject(error);
            },
        );
    }

    get axiosRef(): AxiosInstance {
        return this._instance;
    }

    request<T = any>(
        config: AxiosRequestConfig,
        retryConfig = defaultRetryConfig,
    ): Observable<AxiosResponse<T>> {
        return this.makeObservable<T>(
            retryConfig,
            this._instance.request,
            config,
        );
    }

    get<T = any>(
        url: string,
        config?: AxiosRequestConfig,
        retryConfig = defaultRetryConfig,
    ): Observable<AxiosResponse<T>> {
        return this.makeObservable<T>(
            retryConfig,
            this._instance.get,
            url,
            config,
        );
    }

    delete<T = any>(
        url: string,
        config?: AxiosRequestConfig,
        retryConfig = defaultRetryConfig,
    ): Observable<AxiosResponse<T>> {
        return this.makeObservable<T>(
            retryConfig,
            this._instance.delete,
            url,
            config,
        );
    }

    head<T = any>(
        url: string,
        config?: AxiosRequestConfig,
        retryConfig = defaultRetryConfig,
    ): Observable<AxiosResponse<T>> {
        return this.makeObservable<T>(
            retryConfig,
            this._instance.head,
            url,
            config,
        );
    }

    post<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
        retryConfig = defaultRetryConfig,
    ): Observable<AxiosResponse<T>> {
        return this.makeObservable<T>(
            retryConfig,
            this._instance.post,
            url,
            data,
            config,
        );
    }

    put<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
        retryConfig = defaultRetryConfig,
    ): Observable<AxiosResponse<T>> {
        return this.makeObservable<T>(
            retryConfig,
            this._instance.put,
            url,
            data,
            config,
        );
    }

    patch<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
        retryConfig = defaultRetryConfig,
    ): Observable<AxiosResponse<T>> {
        return this.makeObservable<T>(
            retryConfig,
            this._instance.patch,
            url,
            data,
            config,
        );
    }

    private makeObservable<T>(
        retryConfig: { count: number; delayMultiplier: number },
        axios: (...args: any[]) => AxiosPromise<T>,
        ...args: any[]
    ): Observable<AxiosResponse<T>> {
        return new Observable<AxiosResponse<T>>((subscriber) => {
            const config: AxiosRequestConfig = {
                ...(args[args.length - 1] || {}),
            };

            let cancelSource: CancelTokenSource = undefined;
            if (!config.cancelToken) {
                cancelSource = Axios.CancelToken.source();
                config.cancelToken = cancelSource.token;
            }

            axios(...args)
                .then((res) => {
                    subscriber.next(res);
                    subscriber.complete();
                })
                .catch((err) => {
                    subscriber.error(err);
                });
            return (): void => {
                if (config.responseType === 'stream') {
                    return;
                }

                if (cancelSource) {
                    cancelSource.cancel();
                }
            };
        }).pipe(
            retry({
                count: retryConfig.count,
                delay: (error, retryCount): ObservableInput<number> => {
                    const DELAY_MS = retryCount * retryConfig.delayMultiplier;
                    this._logger.warn(
                        `Retrying request to ${error?.config?.url} in ${DELAY_MS}ms`,
                    );
                    return of(DELAY_MS);
                },
            }),
        );
    }

    private _logRequestCall(
        response: AxiosResponse & { config: AxiosRequestMeta },
    ): void {
        let logData = undefined;
        let logLevel: any = 'log';

        const duration = Date.now() - response.config.meta.requestStartTime;

        switch (this._configService.get(CONFIG_KEYS.LOG_LEVEL)) {
            case LogLevels.DEBUG:
                logLevel = LogLevels.DEBUG;
                logData = {
                    request: {
                        url: response.config.url,
                        method: response.config.method,
                        headers: response.config.headers,
                        data: response.config.data,
                    },
                    response: {
                        status: response.status,
                        statusText: response.statusText,
                        data: response.data,
                        headers: response.headers,
                        duration,
                    },
                };
                break;
            case LogLevels.INFO:
                logData = {
                    method: response.config.method,
                    url: response.config.url,
                    status: response.status,
                    duration,
                };
                break;
            case LogLevels.TRACE:
            case LogLevels.SILENT:
                logLevel = 'verbose';
                logData = {
                    ...response,
                    duration,
                };
                break;
            default:
                break;
        }

        this._logger[logLevel](logData);
    }

    private _logRequestError(
        error: AxiosError & { response?: { config?: AxiosRequestMeta } },
    ): void {
        const err = new Error(error.message);

        err.name = error.name;
        err.stack = error.stack;

        const duration =
            Date.now() -
            (error.response?.config?.meta?.requestStartTime || Date.now());

        this._logger.error({
            ...err,
            request: {
                url: error.config.url,
                method: error.config.method,
                headers: error.config.headers,
                data: error.config.data,
                params: error.config.params,
            },
            response: {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                headers: error.response?.headers,
                duration,
            },
        });
    }
}
