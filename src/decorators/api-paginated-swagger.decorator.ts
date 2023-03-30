import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiPaginatedSwagger = <TModel extends Type<unknown>>(
    model: TModel,
): any => {
    return applyDecorators(
        ApiOkResponse({
            schema: {
                allOf: [
                    {
                        properties: {
                            items: {
                                type: 'array',
                                items: { $ref: getSchemaPath(model) },
                            },
                            meta: {
                                type: 'object',
                                properties: {
                                    itemCount: {
                                        type: 'number',
                                    },
                                    totalItems: {
                                        type: 'number',
                                    },
                                    itemsPerPage: {
                                        type: 'number',
                                    },
                                    totalPages: {
                                        type: 'number',
                                    },
                                    currentPage: {
                                        type: 'number',
                                    },
                                },
                            },
                        },
                    },
                ],
            },
        }),
    );
};
