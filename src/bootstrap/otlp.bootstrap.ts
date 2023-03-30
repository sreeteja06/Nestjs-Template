import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import * as opentelemetry from '@opentelemetry/sdk-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from '../constants/system.constant';
import { joinUrlSegments } from '../utils/url.util';
import { Logger } from '@nestjs/common';

export const otlpCollector = async (
    serviceName: string,
    configService: ConfigService,
): Promise<void> => {
    if (!configService.get(CONFIG_KEYS.OTLP_COLLECTOR_URL)) {
        return;
    }

    const exporterOptions = {
        url: joinUrlSegments(
            configService.get(CONFIG_KEYS.OTLP_COLLECTOR_URL),
            'v1',
            'traces',
        ),
    };

    const traceExporter = new OTLPTraceExporter(exporterOptions);

    const nodeSDK = new opentelemetry.NodeSDK({
        traceExporter,
        instrumentations: [
            getNodeAutoInstrumentations({
                '@opentelemetry/instrumentation-fs': {
                    enabled: false,
                },
                '@opentelemetry/instrumentation-amqplib': {
                    enabled: false,
                },
            }),
        ],
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
    });

    // gracefully shut down the SDK on process exit
    process.on('SIGTERM', async () => {
        try {
            await nodeSDK.shutdown();
            Logger.log('Tracing terminated');
        } catch (e: any) {
            Logger.error(e);
        } finally {
            process.exit(0);
        }
    });

    return nodeSDK.start();
};
