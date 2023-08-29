import {
  type QueryKey,
  type QueryFunction,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { type GeneratePostResponse } from "~/lib/third-party-api/generate";

const transform = (data: GeneratePostResponse) => Object.values(data);

export const useGenerateQuery = (
  queryKey: QueryKey,
  queryFn: QueryFunction<unknown>,
  onClick?: (() => void) | undefined
) => {
  const {
    data,
    isFetching,
    isFetched,
    refetch,
    fetchStatus,
  }: UseQueryResult<GeneratePostResponse, Error> = useQuery(queryKey, queryFn, {
    enabled: false,
  });
  return {
    data: data && transform(data),
    isFetching,
    fetchStatus,
    onClick: async () => {
      if (onClick) {
        onClick();
      }
      if (!isFetched) {
        await refetch();
      }
    },
  };
};
