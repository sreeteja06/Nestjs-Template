export const enumUnreachable = (_: never): never => {
    throw new Error(`${_} value is unreachable`);
};
