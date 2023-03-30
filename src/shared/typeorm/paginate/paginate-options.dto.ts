import { IsInt, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import {
    PAGINATION_DEFAULT_LIMIT,
    PAGINATION_DEFAULT_PAGE,
} from '../../../constants/system.constant';

export class PaginateOptionsDto {
    @IsPositive()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number = PAGINATION_DEFAULT_PAGE;

    @IsPositive()
    @IsInt()
    @Type(() => Number)
    limit?: number = PAGINATION_DEFAULT_LIMIT;
}
