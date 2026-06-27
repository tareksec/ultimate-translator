import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { HealthStatus, ReplyTranslateInput, ReplyTranslateResult, TranslateInput, TranslateResult } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getTranslateUrl: () => string;
/**
 * @summary Translate text
 */
export declare const translate: (translateInput: TranslateInput, options?: RequestInit) => Promise<TranslateResult>;
export declare const getTranslateMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof translate>>, TError, {
        data: BodyType<TranslateInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof translate>>, TError, {
    data: BodyType<TranslateInput>;
}, TContext>;
export type TranslateMutationResult = NonNullable<Awaited<ReturnType<typeof translate>>>;
export type TranslateMutationBody = BodyType<TranslateInput>;
export type TranslateMutationError = ErrorType<unknown>;
/**
* @summary Translate text
*/
export declare const useTranslate: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof translate>>, TError, {
        data: BodyType<TranslateInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof translate>>, TError, {
    data: BodyType<TranslateInput>;
}, TContext>;
export declare const getReplyTranslateUrl: () => string;
/**
 * @summary Translate a reply in context
 */
export declare const replyTranslate: (replyTranslateInput: ReplyTranslateInput, options?: RequestInit) => Promise<ReplyTranslateResult>;
export declare const getReplyTranslateMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof replyTranslate>>, TError, {
        data: BodyType<ReplyTranslateInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof replyTranslate>>, TError, {
    data: BodyType<ReplyTranslateInput>;
}, TContext>;
export type ReplyTranslateMutationResult = NonNullable<Awaited<ReturnType<typeof replyTranslate>>>;
export type ReplyTranslateMutationBody = BodyType<ReplyTranslateInput>;
export type ReplyTranslateMutationError = ErrorType<unknown>;
/**
* @summary Translate a reply in context
*/
export declare const useReplyTranslate: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof replyTranslate>>, TError, {
        data: BodyType<ReplyTranslateInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof replyTranslate>>, TError, {
    data: BodyType<ReplyTranslateInput>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map