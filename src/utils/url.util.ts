import { joinNotEmptyNorWhitespace } from './array.util';

/**
 * Function to normalise URL by doing the following:
 * 1. Trim all leading and trailing slashes and/or white spaces (including sequential ones),
 * e.g. _/ / / url1/url2 / / /_ will become _url1/url2_)
 */

export const normaliseUrl = (url: string | undefined): string => {
    return url?.replace(/(?:^[\\/ ]+)|(?:[\\/ ]+$)/g, '') ?? '';
};

export const joinUrlSegments = (
    urlSegment: string,
    ...otherUrlSegments: string[]
): string => {
    const trimmedUrlSegments: string[] = [urlSegment, ...otherUrlSegments].map(
        (x) => normaliseUrl(x),
    );
    return joinNotEmptyNorWhitespace(trimmedUrlSegments, '/').replace(
        '/?',
        '?',
    ); // Remove slash in front of the query string
};
