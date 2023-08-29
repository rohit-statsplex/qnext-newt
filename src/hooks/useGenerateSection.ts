import { useQuery } from "@tanstack/react-query";
import { type Article } from "~/components/NewsletterLiveForm/schemas";
import {
  generatePostRequest,
  generateDefaultRequest,
  type GeneratePostResponse,
  transformGenerate,
} from "~/lib/third-party-api/generate";
import {
  parsePostRequest,
  parseDefaultRequest,
  type ParsePostResponse,
  transformParse,
} from "~/lib/third-party-api/parse";

export const useGenerateSection = (
  articles: Article[],
  sectionIndex: number,
  queryKey: number
) => {
  const queryParseUrls = useQuery(
    ["parseUrls", sectionIndex, queryKey],
    () =>
      parsePostRequest({
        ...parseDefaultRequest,
        urls: articles.filter((a) => a.isUrl).map((a) => a?.url ?? ""),
      }),
    {
      enabled: queryKey !== 0,
      select: (data: ParsePostResponse) => transformParse(data),
    }
  );

  const queryGenerate = useQuery(
    ["generate", sectionIndex, queryKey],
    () => {
      const parsedArticles = queryParseUrls.data;
      const textTitleArticles = articles.map((a) => {
        if (a.isUrl) {
          return (
            parsedArticles?.find((pa) => pa.url === a.url) ?? {
              title: "",
              text: "",
            }
          );
        }
        return {
          title: a.title ?? "",
          text: a.body ?? "",
        };
      });

      if (textTitleArticles?.length > 0) {
        return generatePostRequest({
          ...generateDefaultRequest,
          titles: textTitleArticles.map((a) => a.title),
          texts: textTitleArticles.map((a) => a.text),
        });
      }
      return new Promise((resolve, reject) => reject("No parsed Articles!"));
    },
    {
      enabled: queryParseUrls.isSuccess,
      select: (data: GeneratePostResponse) => transformGenerate(data),
    }
  );
  return { queryGenerate, queryParseUrls };
};
