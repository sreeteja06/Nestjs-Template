import { createHash } from 'crypto';

export const generateHashFromJson = (json: unknown): string => {
    return createHash('sha512').update(JSON.stringify(json)).digest('hex');
};
