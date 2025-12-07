import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const ActiveAccountId = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>();
        const headerValue = request.headers['x-account-id'];
        const queryValue = request.query.accountId;

        const resolved =
            Array.isArray(headerValue) && headerValue.length > 0
                ? headerValue[0]
                : typeof headerValue === 'string'
                  ? headerValue
                  : Array.isArray(queryValue) && queryValue.length > 0
                    ? queryValue[0]
                    : typeof queryValue === 'string'
                      ? queryValue
                      : undefined;

        return typeof resolved === 'string' && resolved.trim().length > 0
            ? resolved
            : undefined;
    },
);
