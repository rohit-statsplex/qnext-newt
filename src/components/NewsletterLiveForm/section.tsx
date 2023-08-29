/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "../ui/button";
import { Article } from "./article";
import {
  type NewsletterFormData,
  defaultNewArticle,
  MAX_ARTICLE_COUNT,
  // type ParsedArticleUpdate,
} from "./schemas";
import {
  areAllArticlesPreviewable,
  // isAnyArticlePreviewable,
  validateSection,
} from "./utils";
import { onPromise } from "~/lib/utils";
import { useGenerateSection } from "~/hooks/useGenerateSection";
import { type GenerateArticleResponse } from "~/lib/third-party-api/generate";

type SectionProps = {
  sectionIndex: number;
  hideNextSection: boolean;
  setGeneratedSection: (articles: GenerateArticleResponse[]) => void;
  // setParsedSection: (parsedArticles: (ParsedArticleUpdate | undefined)[]) => void;
  gotoNextSection: () => void;
};

export const Section: React.FC<SectionProps> = ({
  sectionIndex,
  hideNextSection,
  setGeneratedSection,
  // setParsedSection,
  gotoNextSection,
}) => {
  const { control, watch, trigger } = useFormContext<NewsletterFormData>();
  const {
    fields: articleFields,
    append: appendArticle,
    remove: removeArticle,
  } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.articles` as const,
  });
  const articles = watch(`sections.${sectionIndex}.articles` as const);

  const [queryKey, setQueryKey] = useState(0);

  const { queryParseUrls, queryGenerate } = useGenerateSection(
    articles,
    sectionIndex,
    queryKey
  );
  const isLoading = queryParseUrls.isFetching || queryGenerate.isFetching;

  useEffect(() => {
    if (queryGenerate.data) {
      setGeneratedSection(queryGenerate.data);
    }
  }, [queryGenerate.data]);

  useEffect(() => {
    if (queryParseUrls.data) {
      queryParseUrls.data
        .map((article) => {
          if (article?.error_info) {
            console.log(article.error_info);
            return;
          }

          return {
            sectionIndex,
            articleIndex: articles.findIndex((a) => a.url === article.url),
            article,
          };
        })
        .filter(Boolean);
      // setParsedSection(parsedArticleUpdates);
    }
  }, [queryParseUrls.data]);

  // const onPreviewSection = onPromise(async (e) => {
  //   e.preventDefault();
  //   const isValid = await validateSection(trigger, sectionIndex);
  //   if (isValid) {
  //     !isLoading && setQueryKey((prevKey) => prevKey + 1);
  //   }
  // });
  const onNextSection = onPromise(async () => {
    const isValid = await validateSection(trigger, sectionIndex);
    if (isValid && !isLoading) {
      setQueryKey((prevKey) => prevKey + 1);
      gotoNextSection();
    }
  });
  return (
    <>
      {articleFields.map((articleField, articleIndex) => (
        <Article
          key={articleField.id}
          articleIndex={articleIndex}
          sectionIndex={sectionIndex}
          disabled={isLoading}
          removeAnArticle={() =>
            articleFields.length > 1 && removeArticle(articleIndex)
          }
        />
      ))}
      <div className="flex justify-between">
        <Button
          type="button"
          onClick={() => appendArticle(defaultNewArticle)}
          disabled={articleFields.length >= MAX_ARTICLE_COUNT}
        >
          Add Article
        </Button>
        {/* <Button
          type="button"
          onClick={onPreviewSection}
          disabled={isLoading || !isAnyArticlePreviewable(articles)}
        >
          Preview Section
        </Button> */}
      </div>
      <div className="flex justify-end">
        {!hideNextSection && (
          <Button
            type="button"
            onClick={onNextSection}
            disabled={!areAllArticlesPreviewable(articles)}
          >
            Next Section
          </Button>
        )}
      </div>
    </>
  );
};
