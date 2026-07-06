import { useMutation, UseMutationResult } from '@tanstack/react-query';
import container from '@/infrastructure/Container';
import { NetworkRequest } from '../infrastructure/BaseNetworkRequest';

export function useRequestMutation<Data, Response, RequestOutput>(
  RequestClass: new (
    ...args: any[]
  ) => NetworkRequest<Data, Response, RequestOutput, any>,
  options?: {
    onSuccess?: (data: Response) => void;
    onError?: (error: Error) => void;
  },
): UseMutationResult<Response, Error, Data> {
  const requestInstance = container.get(RequestClass);

  return useMutation({
    mutationFn: (variables: Data) => {
      return requestInstance.execute(variables, {
        mock: false,
        skipCache: true,
      });
    },
    onSuccess: (data, variables) => {
      requestInstance.invalidate(variables);

      if (options?.onSuccess) options.onSuccess(data);
    },
    onError: (error) => {
      if (options?.onError) options.onError(error);
    },
  });
}
