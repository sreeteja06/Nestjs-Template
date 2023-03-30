import { DeleteResult, UpdateResult } from 'typeorm';

const UNAFFECTED = 0;

const IsRowAffected = (data: DeleteResult | UpdateResult): string => {
    if (data.affected === UNAFFECTED) {
        return undefined;
    }
    return 'ok';
};

export { IsRowAffected };
