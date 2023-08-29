import { X as XIcon, MoveRight } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "../ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { type NewsletterFormData } from "./schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  parsePostRequest,
  parseDefaultRequest,
  type ParsePostResponse,
  transformParse,
} from "~/lib/third-party-api/parse";
import { useGenerated } from "~/hooks/generatedProvider";

type ArticleProps = {
  articleIndex: number;
  sectionIndex: number;
  removeAnArticle: (index: number) => void;
  disabled?: boolean;
};

export const Article: React.FC<ArticleProps> = ({
  articleIndex,
  sectionIndex,
  removeAnArticle,
  disabled = false,
}) => {
  const { generated, setGenerated } = useGenerated();
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<NewsletterFormData>();
  const isUrlKey =
    `sections.${sectionIndex}.articles.${articleIndex}.isUrl` as const;
  const isUrl = watch(isUrlKey);
  const urlKey =
    `sections.${sectionIndex}.articles.${articleIndex}.url` as const;
  const url = watch(urlKey);

  const handleTabsChange = (isUrl: string) =>
    setValue(isUrlKey, isUrl === "true");

  const [queryKey, setQueryKey] = useState(0);
  const queryParseUrls = useQuery(
    ["parseUrls", sectionIndex, queryKey],
    () =>
      parsePostRequest({
        ...parseDefaultRequest,
        urls: [url ?? ""],
      }),
    {
      enabled: queryKey !== 0,
      select: (data: ParsePostResponse) => transformParse(data),
    }
  );
  useEffect(() => {
    if (queryParseUrls.data) {
      const parsedArticle = queryParseUrls.data?.[0];
      if (parsedArticle) {
        const newParsedSections = generated.parsedSections;
        newParsedSections[`s${sectionIndex}a${articleIndex}`] = {
          ...parsedArticle,
          status: "success",
        };
        setGenerated({
          ...generated,
          parsedSections: newParsedSections,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParseUrls.data]);
  const onParseClick = () => {
    if (isUrl && url !== "") {
      if (!queryParseUrls.isFetching) {
        setQueryKey((prevKey) => prevKey + 1);
      }
    }
  };

  return (
    <Tabs
      value={isUrl.toString()}
      onValueChange={handleTabsChange}
      className="my-4"
    >
      <div className="flex justify-between">
        <TabsList>
          <TabsTrigger value="true">URL</TabsTrigger>
          <TabsTrigger value="false">Text</TabsTrigger>
        </TabsList>
        <XIcon
          className="pl-2 pr-0"
          onClick={() => removeAnArticle(articleIndex)}
        />
      </div>
      <TabsContent value="true" className="mt-4">
        <FormField
          control={control}
          name={
            `sections.${sectionIndex}.articles.${articleIndex}.url` as const
          }
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormControl>
                <div className="flex gap-2">
                  <Input
                    placeholder={`Enter URL for Article ${articleIndex + 1}`}
                    {...field}
                    disabled={disabled}
                  />
                  <Button
                    type="button"
                    onClick={onParseClick}
                    disabled={queryParseUrls?.isFetching}
                  >
                    <MoveRight />
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormMessage className="my-3">
          {errors?.sections?.[sectionIndex]?.articles?.[articleIndex]?.message}
        </FormMessage>
      </TabsContent>
      <TabsContent value="false" className="mt-4 space-y-4">
        <FormField
          control={control}
          name={
            `sections.${sectionIndex}.articles.${articleIndex}.title` as const
          }
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={`Enter title for Article ${articleIndex + 1}`}
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={
            `sections.${sectionIndex}.articles.${articleIndex}.body` as const
          }
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder={`Enter body for Article ${articleIndex + 1}`}
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormMessage className="my-3">
          {errors?.sections?.[sectionIndex]?.articles?.[articleIndex]?.message}
        </FormMessage>
      </TabsContent>
    </Tabs>
  );
};
