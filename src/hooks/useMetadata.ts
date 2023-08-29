// const { data, isLoading } = api.urlMetadata.metadata.useQuery();

// import {
//   type QueryKey,
//   type QueryFunction,
//   type UseQueryResult,
//   useQuery,
// } from "@tanstack/react-query";
// import { transform } from "framer-motion";
// import { type GeneratePostResponse } from "~/lib/third-party-api/generate";

// export const useGenerateQuery = (
//   queryKey: QueryKey,
//   queryFn: QueryFunction<unknown>,
//   onClick?: (() => void) | undefined
// ) => {
//   const {
//     data,
//     isFetching,
//     isFetched,
//     refetch,
//     fetchStatus,
//   }: UseQueryResult<GeneratePostResponse, Error> = useQuery(queryKey, queryFn, {
//     enabled: false,
//   });
//   return {
//     data: data && transform(data),
//     isFetching,
//     fetchStatus,
//     onClick: async () => {
//       if (onClick) {
//         onClick();
//       }
//       if (!isFetched) {
//         await refetch();
//       }
//     },
//   };
// };
