import { useQuery, UseQueryResult } from '@tanstack/react-query';
import container from '@/infrastructure/Container';
import { NetworkRequest } from '../infrastructure/BaseNetworkRequest';

export function useRequestQuery<Data, Response, RequestOutput>(
  RequestClass: new (
    ...args: any[]
  ) => NetworkRequest<Data, Response, RequestOutput, any>,
  variables: Data,
  options?: { enabled?: boolean; staleTime?: number },
): UseQueryResult<Response, Error> {
  const requestInstance = container.get(RequestClass);

  const queryKey = requestInstance.cacheKey
    ? [requestInstance.name, ...requestInstance.cacheKey(variables)]
    : [requestInstance.name, variables];

  return useQuery({
    queryKey,
    queryFn: () => requestInstance.execute(variables, { mock: false }),
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? requestInstance['staleTime'],
  });
}
