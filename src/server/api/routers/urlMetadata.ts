import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

enum MetadataType {
  Article = "article",
  Video = "video",
  // Add more types as needed
}

type Metadata = {
  title: string;
  description: string;
  image: string;
  url: string;
  site_name: string;
  type: MetadataType;
};
async function fetchAll(urls: string[]): Promise<Metadata[]> {
  const fetchPromises = urls.map(async (url) => {
    const response = await fetch(url);
    const metadata = (await response.json()) as unknown as Metadata;
    return metadata;
  });

  const results = await Promise.all(fetchPromises);
  return results;
}

export const urlMetadataRouter = createTRPCRouter({
  metadata: publicProcedure
    .input(z.object({ urls: z.array(z.string().url()) }))
    .query(async ({ input }) => await fetchAll(input.urls)),
});
