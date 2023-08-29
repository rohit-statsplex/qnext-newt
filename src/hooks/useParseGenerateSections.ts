import { useQueries } from "@tanstack/react-query";
import {
  type NewsletterFormData,
  type NonGeneratedSections,
} from "~/components/NewsletterLiveForm/schemas";
import {
  type GenerateArticleResponse,
  type GeneratePostResponse,
  generateDefaultRequest,
  generatePostRequest,
  transformGenerate,
} from "~/lib/third-party-api/generate";
import {
  type ParsePostResponse,
  parseDefaultRequest,
  parsePostRequest,
  transformParse,
} from "~/lib/third-party-api/parse";

type PA = {
  title: string;
  text: string;
  url: string;
  error_info: string | undefined;
  error_code: number | undefined;
}[];

const getTextTitleArticles = (
  articles: NewsletterFormData["sections"][number]["articles"],
  parsedArticles: PA
) =>
  articles.map((a) => {
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

export const useParseGenerateSections = (
  nonGeneratedSection: NonGeneratedSections
) =>
  useQueries({
    queries: nonGeneratedSection.map(({ articles, sectionIndex }) => ({
      queryKey: ["parseGenerate", sectionIndex],
      queryFn: () =>
        parsePostRequest({
          ...parseDefaultRequest,
          urls: articles.filter((a) => a.isUrl).map((a) => a?.url ?? ""),
        })
          .then((data: ParsePostResponse) => transformParse(data))
          .then((parsedArticles) =>
            getTextTitleArticles(articles, parsedArticles)
          )
          .then((textTitleArticles) =>
            generatePostRequest({
              ...generateDefaultRequest,
              titles: textTitleArticles.map((a) => a.title),
              texts: textTitleArticles.map((a) => a.text),
            })
          )
          .then((data: GeneratePostResponse) => transformGenerate(data))
          .then((articles: GenerateArticleResponse[]) => ({
            articles: articles.map((a) => ({
              ...a,
              status: "success",
            })),
            sectionIndex,
          })),
    })),
  });
