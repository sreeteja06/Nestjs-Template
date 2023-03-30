import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

const IP_PORT_SPLIT_LENGTH = 2;

const IpV4Regex =
    /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/;

const IpV6Regex =
    // eslint-disable-next-line max-len
    /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;

const isIp = (value: string): boolean => {
    return RegExp(IpV4Regex).test(value) || RegExp(IpV6Regex).test(value);
};

const getClientIpFromXForwardedFor = (value: string): string => {
    if (!value) {
        return null;
    }

    const forwardedIps = value.split(',').map((e) => {
        const ip: string = e.trim();
        if (ip.includes(':')) {
            const split = ip.split(':');
            // make sure we only use this if it's ipv4 (ip:port)
            if (split.length === IP_PORT_SPLIT_LENGTH) {
                return split[0];
            }
        }
        return ip;
    });

    return forwardedIps.find(isIp);
};

export const extractIp = (req: Request): string => {
    if (req.headers) {
        const xForwardedFor = getClientIpFromXForwardedFor(
            String(req.headers['x-forwarded-for']),
        );

        if (isIp(String(req.headers['x-client-ip']))) {
            return String(req.headers['x-client-ip']);
        } else if (isIp(xForwardedFor)) {
            return xForwardedFor;
        } else if (isIp(String(req.headers['cf-connecting-ip']))) {
            return String(req.headers['cf-connecting-ip']);
        } else if (isIp(String(req.headers['fastly-client-ip']))) {
            return String(req.headers['fastly-client-ip']);
        } else if (isIp(String(req.headers['true-client-ip']))) {
            return String(req.headers['true-client-ip']);
        } else if (isIp(String(req.headers['x-real-ip']))) {
            return String(req.headers['x-real-ip']);
        } else if (isIp(String(req.headers['x-cluster-client-ip']))) {
            return String(req.headers['x-cluster-client-ip']);
        } else if (isIp(String(req.headers['x-forwarded']))) {
            return String(req.headers['x-forwarded']);
        } else if (isIp(String(req.headers['forwarded-for']))) {
            return String(req.headers['forwarded-for']);
        } else if (isIp(req.headers.forwarded)) {
            return req.headers.forwarded;
        }
    }
};

/**
 * Decorator to extract ip address from the request
 */
export const IpAddress = createParamDecorator((data, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    return extractIp(req);
});
