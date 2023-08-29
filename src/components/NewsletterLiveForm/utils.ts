import { type UseFormTrigger } from "react-hook-form";
import {
  defaultNewArticle,
  type Article,
  type NewsletterFormData,
  type Section,
  type GeneratedSection,
} from "./schemas";

export const isValidUrl = (urlString: string) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

export const checkArticlePreviewable = (article: Article) =>
  (article.isUrl &&
    article.url !== defaultNewArticle.url &&
    article.url &&
    isValidUrl(article.url)) ||
  (!article.isUrl && article.title !== defaultNewArticle.title) ||
  (!article.isUrl && article.body !== defaultNewArticle.body);

export const isAnyArticlePreviewable = (articles: Article[]) =>
  articles.some((article) => checkArticlePreviewable(article));

export const areAllArticlesPreviewable = (articles: Article[]) =>
  articles.every((article) => checkArticlePreviewable(article));

export const areAllSectionsPreviewable = (sections: Section[]) =>
  sections.every((section) => areAllArticlesPreviewable(section.articles));

export const validateSection = async (
  trigger: UseFormTrigger<NewsletterFormData>,
  index: number
) => await trigger([`sections.${index}.articles` as const]);

export const getTitlesAndTextsFrom = (articles: Article[]) => {
  return {
    titles: articles.map((a) => a.title ?? ""),
    texts: articles.map((a) => a.body ?? ""),
  };
};

export const filterNonGeneratedSections = (
  sections: NewsletterFormData["sections"],
  generatedSections: GeneratedSection[]
) => {
  const resultSections = sections.map((section, sid) => ({
    articles: section.articles,
    sectionIndex: sid,
  }));
  if (
    generatedSections?.length === resultSections?.length &&
    resultSections.every(
      (s, sid) =>
        s.articles?.length ===
        (generatedSections?.[sid]?.articles &&
          generatedSections[sid]?.articles?.length)
    )
  ) {
    return [];
  }
  return resultSections;
};
