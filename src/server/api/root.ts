import { newsletterRouter } from "~/server/api/routers/newsletter";
import { urlMetadataRouter } from "~/server/api/routers/urlMetadata";

import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  newsletters: newsletterRouter,
  urlMetadata: urlMetadataRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
