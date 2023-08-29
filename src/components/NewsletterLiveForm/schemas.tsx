import { z } from "zod";
import { isValidUrl } from "./utils";
import { type GenerateArticleResponse } from "~/lib/third-party-api/generate";
import { type ParsePostResponse } from "~/lib/third-party-api/parse";

export const articleSchema = z
  .object({
    isUrl: z.boolean(),
    url: z.string().optional(),
    title: z.string().optional(),
    body: z.string().optional(),
    textOptions: z.any().optional(),
  })
  .refine((data) => !(!data.isUrl && data.title === ""), {
    message: "Article title can not be blank in text mode",
  })
  .refine((data) => !(data.isUrl && data.url === ""), {
    message: "Article url can not be blank in url mode",
  })
  .refine((data) => !(data.isUrl && data.url && !isValidUrl(data.url)), {
    message: "Article URL must be valid",
  });
export type Article = z.infer<typeof articleSchema>;

export const sectionSchema = z.object({
  articles: z.array(articleSchema),
});
export type Section = z.infer<typeof sectionSchema>;

export const validateTitle = (title: string) => title?.length >= 2;
export const newsletterformSchema = z.object({
  title: z.string().min(2, {
    message: "Title must have at least 2 characters.",
  }),
  introductoryParagraph: z.string().optional(),
  numberOfSections: z.string(), //.transform(Number),
  sections: z.array(sectionSchema),
});

export type NewsletterFormData = z.infer<typeof newsletterformSchema>;
export const defaultNewsletter = {
  numberOfSections: "1",
};

export const defaultNewArticle = { isUrl: true, url: "", title: "", body: "" };
export const defaultNewSection = {
  articles: [defaultNewArticle],
};
export const MAX_ARTICLE_COUNT = 5;
export const MAX_SECTION_COUNT = 3;

export const shouldGenerateSummaryText =
  "The Introductory Paragraph will be displayed after you enter the articles";

export type ArticleStyles = {
  fontSize: string;
  bold: boolean;
  italics: boolean;
};

export type GeneratedArticle = Partial<GenerateArticleResponse> & {
  status: string;
  style?: ArticleStyles;
  summary?: string;
};
export const defaultGeneratedArticle = {
  status: "initial",
};
export type GeneratedSection = {
  articles?: GeneratedArticle[];
};
export const defaultGeneratedSection = {
  articles: [defaultGeneratedArticle],
};

export type ParsedArticleUpdate = {
  sectionIndex: number;
  articleIndex: number;
  article: ParsePostResponse[number];
};
export type ParsedArticle = {
  title?: string;
  text?: string;
  url?: string;
  status: string;
};
export type Generated = {
  shouldGenarateSummary: boolean;
  sections: GeneratedSection[];
  parsedSections: { [key: string]: ParsedArticle };
};

export const defaultGenerated: Generated = {
  shouldGenarateSummary: false,
  sections: [defaultGeneratedSection],
  parsedSections: { s0a0: { status: "initial" } },
};

export type NonGeneratedSections = {
  articles: NewsletterFormData["sections"][number]["articles"];
  sectionIndex: number;
}[];
