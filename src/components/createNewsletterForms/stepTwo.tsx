/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import * as z from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  useFieldArray,
  type SubmitHandler,
  type UseFormReturn,
  type UseFieldArrayUpdate,
} from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const ArticleSchema = z.object({
  url: z.string().optional(),
  text: z
    .object({
      title: z.string(),
      body: z.string(),
    })
    .optional(),
});

const SectionSchema = z.object({
  articles: z.array(ArticleSchema),
});

export const formSchema = z.object({
  sections: z.array(SectionSchema),
});

export const getDefaultSections = (numberOfSections: number) =>
  new Array(numberOfSections).fill(0).map(() => ({
    articles: [
      {
        text: { title: "", body: "" },
        url: "",
      },
    ],
  }));

export const defaultValues = {
  sections: getDefaultSections(1),
};

const Article = ({
  section,
  articleIndex,
  sectionIndex,
  form,
  update,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  section: z.infer<typeof SectionSchema>;
  articleIndex: number;
  sectionIndex: number;
  update: UseFieldArrayUpdate<z.infer<typeof formSchema>, "sections">;
}) => {
  return (
    <div className="relative">
      <Tabs defaultValue={`URL-s${sectionIndex}-a${articleIndex}`}>
        <TabsList className="">
          <TabsTrigger value={`URL-s${sectionIndex}-a${articleIndex}`}>
            URL
          </TabsTrigger>
          <TabsTrigger value={`Text-s${sectionIndex}-a${articleIndex}`}>
            Text
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value={`URL-s${sectionIndex}-a${articleIndex}`}
          className="space-y-4 rounded border bg-white p-4"
        >
          <FormField
            control={form.control}
            name={`sections.${sectionIndex}.articles.${articleIndex}.url`}
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`Enter URL for Article ${articleIndex + 1}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage>&nbsp;</FormMessage>
              </FormItem>
            )}
          />
        </TabsContent>
        <TabsContent
          value={`Text-s${sectionIndex}-a${articleIndex}`}
          className="space-y-4 rounded border bg-white p-4"
        >
          <FormField
            control={form.control}
            name={`sections.${sectionIndex}.articles.${articleIndex}.text.title`}
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`Enter title for Article ${articleIndex + 1}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage>&nbsp;</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`sections.${sectionIndex}.articles.${articleIndex}.text.body`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={`Enter body for Article ${articleIndex + 1}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage>&nbsp;</FormMessage>
              </FormItem>
            )}
          />
        </TabsContent>
      </Tabs>

      <Button
        type="button"
        className="absolute right-0 top-0"
        onClick={() => {
          update(sectionIndex, {
            articles: section.articles.filter(
              (_a: z.infer<typeof ArticleSchema>, idx: number) =>
                idx !== articleIndex
            ),
          });
        }}
      >
        x
      </Button>
    </div>
  );
};
export const StepTwo: React.FC<{
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onBackClick: () => void;
  onSubmit: SubmitHandler<z.infer<typeof formSchema>>;
}> = ({ form, onBackClick, onSubmit }) => {
  const { fields, append, update } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        {fields?.length === 0 ? (
          <>0 Sections...</>
        ) : (
          <Tabs defaultValue="sections[0]">
            <TabsList>
              {fields.map((section, index) => (
                <TabsTrigger key={section.id} value={`sections[${index}]`}>
                  Section {index + 1}
                </TabsTrigger>
              ))}
              <TabsTrigger value="addSection">+</TabsTrigger>
            </TabsList>

            {fields.map((section, sectionIndex) => (
              <TabsContent
                key={section.id}
                value={`sections[${sectionIndex}]`}
                className="space-y-4 rounded border bg-white p-6"
              >
                {section?.articles?.map((_article, articleIndex) => (
                  <Article
                    key={`sections.${sectionIndex}.article.${articleIndex}`}
                    {...{ articleIndex, section, sectionIndex, form, update }}
                  />
                ))}

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={() => {
                      update(sectionIndex, {
                        articles: [
                          ...section.articles,
                          {
                            text: { title: "", body: "" },
                            url: "",
                          },
                        ],
                      });
                    }}
                  >
                    Add Article to section {sectionIndex + 1}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      update(sectionIndex, {
                        articles: [
                          ...section.articles,
                          {
                            text: { title: "", body: "" },
                            url: "",
                          },
                        ],
                      });
                    }}
                  >
                    Preview Section
                  </Button>
                </div>
              </TabsContent>
            ))}
            <TabsContent
              value="addSection"
              className="space-y-4 rounded border bg-white p-6"
            >
              <Button type="button" onClick={() => append({ articles: [] })}>
                Add Section
              </Button>
            </TabsContent>
          </Tabs>
        )}
        <div className="flex justify-between">
          <Button onClick={onBackClick}>Back</Button>
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
};
