export const parseJson = <T>(
    json: string,
    allowError = true,
    defaultValue?: T,
): T => {
    try {
        return JSON.parse(json);
    } catch (error) {
        if (!allowError) {
            throw error;
        }
    }
    return defaultValue;
};
