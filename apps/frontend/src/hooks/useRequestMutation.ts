import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';
import { NetworkRequest } from '../infrastructure/BaseNetworkRequest';

type RequestData<T> = T extends NetworkRequest<infer D, any, any, any>
  ? D
  : never;
type RequestResponse<T> = T extends NetworkRequest<any, infer R, any, any>
  ? R
  : never;
type RequestError<T> = T extends NetworkRequest<any, any, any, infer E>
  ? E
  : never;

export function useRequestMutation<
  T extends NetworkRequest<any, any, any, any>,
>(
  request: T,
  options?: Omit<
    UseMutationOptions<RequestResponse<T>, RequestError<T>, RequestData<T>>,
    'mutationFn'
  >,
): UseMutationResult<RequestResponse<T>, RequestError<T>, RequestData<T>> {
  const { onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: (data: RequestData<T>) => request.execute(data),
    onSuccess: (response, variables, onMutateResult, context) => {
      request.invalidate(variables);
      return onSuccess?.(response, variables, onMutateResult, context);
    },
    ...rest,
  });
}