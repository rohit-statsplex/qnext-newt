/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @next/next/no-img-element */
// import { Heading, Text } from "@react-email/components";
import {
  type Dispatch,
  type SetStateAction,
  useState,
  type ReactNode,
  useRef,
  useEffect,
} from "react";
import { X } from "lucide-react";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "../ui/context-menu";
import {
  type NewsletterFormData,
  type Generated,
  shouldGenerateSummaryText,
  type GeneratedArticle,
  type Article,
  type ParsedArticle,
  type ArticleStyles,
} from "./schemas";
import { cn, deepEqual } from "~/lib/utils";
// import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

const getDefaultTextOptions = (generatedArticle?: GeneratedArticle) => ({
  mcq: false,
  attention: false,
  summary: false,
  cliffhanger: false,
  style: {
    italics: generatedArticle?.style?.italics ?? false,
    bold: generatedArticle?.style?.bold ?? false,
    fontSize: generatedArticle?.style?.fontSize ?? "Auto",
  },
});

const getDefaultTitleOptions = (generatedArticle?: GeneratedArticle) => ({
  style: {
    italics: generatedArticle?.style?.italics ?? false,
    bold: generatedArticle?.style?.bold ?? false,
    fontSize: generatedArticle?.style?.fontSize ?? "Auto",
  },
});

const ArticleWithContext = ({
  title,
  text,
  article,
  updateTextOptionsForArticle,
  generatedArticle,
}: {
  title?: string;
  text?: string;
  article: any;
  updateTextOptionsForArticle: (trextOptions: ArticleTextOptions) => void;
  generatedArticle?: GeneratedArticle;
}) => {
  const defaultTextOptions = article?.textOptions
    ? (article.textOptions as ArticleTextOptions)
    : getDefaultTextOptions(generatedArticle);
  const [textOptions, setTextOptions] =
    useState<ArticleTextOptions>(defaultTextOptions);
  const [titleOptions, setTitleOptions] = useState<ArticleStyleOptions>(
    getDefaultTitleOptions(generatedArticle)
  );

  const getTwClasses = (style?: ArticleStyles) => {
    let classString = "";
    if (style) {
      if (style.bold) {
        classString = cn(classString, "font-bold");
      }
      if (style.italics) {
        classString = cn(classString, "italic");
      }
      if (style.fontSize) {
        classString = cn(classString, style.fontSize);
      }
    }
    return classString;
  };

  const textStyles = getTwClasses(textOptions?.style);
  const titleStyles = getTwClasses(titleOptions?.style);

  return (
    <>
      <RightClickStyleContext
        generatedArticle={generatedArticle}
        options={titleOptions}
        setOptions={setTitleOptions}
      >
        {title && (
          <h3
            className={cn(
              "mt-4 scroll-m-20 whitespace-break-spaces text-2xl font-semibold tracking-tight",
              titleStyles
            )}
          >
            {title}
          </h3>
        )}
      </RightClickStyleContext>
      {generatedArticle?.status !== "success" ? (
        <RightClickStyleContext
          generatedArticle={generatedArticle}
          options={titleOptions}
          setOptions={setTitleOptions}
        >
          {text && (
            <p
              className={cn(
                "mt-3 whitespace-break-spaces break-words leading-7 first:mt-0",
                textStyles
              )}
            >
              {text}
            </p>
          )}
        </RightClickStyleContext>
      ) : (
        <RightClickGeneratedAndStyleContext
          generatedArticle={generatedArticle}
          options={textOptions}
          setOptions={(options) => {
            setTextOptions(options);
            updateTextOptionsForArticle(options);
          }}
        >
          {text && (
            <p
              className={cn(
                "mt-3 whitespace-break-spaces break-words leading-7 first:mt-0",
                textStyles
              )}
            >
              {text}
            </p>
          )}
        </RightClickGeneratedAndStyleContext>
      )}

      {generatedArticle?.status === "success" && (
        <>
          {textOptions.mcq && (
            <>
              {generatedArticle?.mcq?.question && (
                <div className="mt-1 whitespace-break-spaces break-words">
                  {generatedArticle.mcq.question}
                  {generatedArticle?.mcq?.options && (
                    <ul className="ml-6 list-[upper-alpha]">
                      {generatedArticle.mcq.options.map((option, i) => (
                        <li key={i}>{option}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </>
          )}
          {textOptions.attention && (
            <p className="mt-1 whitespace-break-spaces break-words font-bold">
              {generatedArticle.attention}
            </p>
          )}
          {textOptions.summary && (
            <p className="mt-1 whitespace-break-spaces break-words">
              {generatedArticle.summary}
            </p>
          )}
          {textOptions.cliffhanger && (
            <p className="mt-1 whitespace-break-spaces break-words px-4 font-bold">
              {generatedArticle.cliffhanger}
            </p>
          )}
        </>
      )}
    </>
  );
};

type ArticleTextOptions = {
  mcq: boolean;
  attention: boolean;
  summary: boolean;
  cliffhanger: boolean;
  style: ArticleStyles;
};
type ArticleStyleOptions = {
  style: ArticleStyles;
};

const EditorArticle = ({
  parsedArticle,
  article,
  updateTextOptionsForArticle,
  generatedArticle,
}: {
  parsedArticle?: ParsedArticle;
  article: Article;
  updateTextOptionsForArticle: (trextOptions: ArticleTextOptions) => void;
  generatedArticle?: GeneratedArticle;
}) => {
  // console.log(`generatedArticleSummary >>>>>`, generatedArticle?.summary);
  return (
    <>
      {generatedArticle?.status !== "initial" ? (
        <ArticleWithContext
          text={generatedArticle?.summary}
          article={article}
          updateTextOptionsForArticle={updateTextOptionsForArticle}
          generatedArticle={generatedArticle}
        />
      ) : parsedArticle?.status !== "initial" ? (
        <ArticleWithContext
          title={parsedArticle?.title}
          text={parsedArticle?.text}
          article={article}
          updateTextOptionsForArticle={updateTextOptionsForArticle}
          generatedArticle={generatedArticle}
        />
      ) : (
        <p className=" text-md mt-3 overflow-hidden text-ellipsis bg-gray-200 p-2 font-medium leading-7 text-foreground first:mt-0">
          {`Summary To be generated`}
        </p>
      )}
      {article?.url &&
        (parsedArticle?.status === "success" ? (
          <ArticleWithContext
            title={parsedArticle?.title}
            text={parsedArticle?.text}
            article={article}
            updateTextOptionsForArticle={updateTextOptionsForArticle}
            generatedArticle={generatedArticle}
          />
        ) : (
          <p className="text-md mt-3 overflow-hidden text-ellipsis bg-gray-200 p-2 font-medium leading-7 text-foreground first:mt-0">
            {`To be generated from ${article.url ?? "Please enter URL"}`}
          </p>
        ))}
    </>
  );
};

const CheckboxItem = ({
  isApplied,
  onClick,
  children,
}: {
  isApplied: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <ContextMenuCheckboxItem checked={isApplied} onClick={onClick}>
    {children}
  </ContextMenuCheckboxItem>
);

const RightClickStyleContext = ({
  options,
  setOptions,
  children,
}: {
  generatedArticle?: GeneratedArticle;
  options: ArticleStyleOptions;
  setOptions: (options: ArticleStyleOptions) => void;
  children: ReactNode;
}) => {
  // SAVE HERE QUIZ AND CLIFFHANGER
  const CheckboxItemStyleOptions = (rowOption: keyof ArticleStyles) => ({
    isApplied: !!options.style[rowOption],
    onClick: () => {
      setOptions({
        ...options,
        style: {
          ...(options?.style ?? {}),
          [rowOption]: !options?.style[rowOption],
        },
      });
    },
  });

  const fontSizes = [
    {
      isApplied: options.style.fontSize === "text-xs",
      text: "12",
      onClick: () =>
        setOptions({
          ...options,
          style: {
            ...(options?.style ?? {}),
            fontSize: "text-xs",
          },
        }),
    },
    {
      isApplied: options.style.fontSize === "text-sm",
      text: "14",
      onClick: () =>
        setOptions({
          ...options,
          style: {
            ...(options?.style ?? {}),
            fontSize: "text-sm",
          },
        }),
    },
    {
      isApplied: options.style.fontSize === "text-base",
      text: "16",
      onClick: () =>
        setOptions({
          ...options,
          style: {
            ...(options?.style ?? {}),
            fontSize: "text-base",
          },
        }),
    },
    {
      isApplied: options.style.fontSize === "text-lg",
      text: "18",
      onClick: () =>
        setOptions({
          ...options,
          style: {
            ...(options?.style ?? {}),
            fontSize: "text-lg",
          },
        }),
    },
    {
      isApplied: options.style.fontSize === "text-xl",
      text: "20",
      onClick: () =>
        setOptions({
          ...options,
          style: {
            ...(options?.style ?? {}),
            fontSize: "text-xl",
          },
        }),
    },
    {
      isApplied: options.style.fontSize === "text-2xl",
      text: "24",
      onClick: () =>
        setOptions({
          ...options,
          style: {
            ...(options?.style ?? {}),
            fontSize: "text-2xl",
          },
        }),
    },
    {
      isApplied: options.style.fontSize === "text-3xl",
      text: "30",
      onClick: () =>
        setOptions({
          ...options,
          style: {
            ...(options?.style ?? {}),
            fontSize: "text-3xl",
          },
        }),
    },
  ];
  const fontSizeAuto = {
    isApplied: !options.style.fontSize || options.style.fontSize === "",
    text: "Auto",
    onClick: () =>
      setOptions({
        ...options,
        style: {
          ...(options?.style ?? {}),
          fontSize: "",
        },
      }),
  };
  return (
    <ContextMenu>
      <div className="relative">
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <CheckboxItem {...CheckboxItemStyleOptions("bold")}>
            Bold
          </CheckboxItem>
          <CheckboxItem {...CheckboxItemStyleOptions("italics")}>
            Italics
          </CheckboxItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger inset>Font size</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              {fontSizes.map(({ isApplied, onClick, text }, i) => (
                <ContextMenuCheckboxItem
                  key={i}
                  checked={isApplied}
                  onClick={onClick}
                >
                  {text}
                </ContextMenuCheckboxItem>
              ))}
              <ContextMenuSeparator />
              <ContextMenuCheckboxItem
                checked={fontSizeAuto.isApplied}
                onClick={fontSizeAuto.onClick}
              >
                {fontSizeAuto.text}
              </ContextMenuCheckboxItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </div>
    </ContextMenu>
  );
};

const RightClickGeneratedAndStyleContext = ({
  options,
  setOptions,
  children,
}: {
  generatedArticle?: GeneratedArticle;
  options: ArticleTextOptions;
  setOptions: (options: ArticleTextOptions) => void;
  children: ReactNode;
}) => {
  const CheckboxItemOptions = (rowOption: keyof ArticleTextOptions) => ({
    isApplied: !!options[rowOption],
    onClick: () =>
      setOptions({
        ...options,
        [rowOption]: !options[rowOption],
      }),
  });

  const CheckboxItemStyleOptions = (rowOption: keyof ArticleStyles) => ({
    isApplied: !!options.style[rowOption],
    onClick: () =>
      setOptions({
        ...options,
        style: {
          ...(options?.style ?? {}),
          [rowOption]: !options?.style[rowOption],
        },
      }),
  });

  const fontSizes = [
    {
      isApplied: options.style.fontSize === "text-xs",
      text: "12",
      onClick: () =>
        setOptions({
          ...options,
          style: {
            ...(options?.style ?? {}),
            fontSize: "text-xs",
          },
        }),
    },
    {
      isApplied: options.style.fontSize === "text-sm",
      text: "14",
      onClick: () =>
        setOptions({
          ...options,
          style: {
            ...(options?.style ?? {}),
            fontSize: "text-sm",
          },
        }),
    },
    {
      isApplied: options.style.fontSize === "text-base",
      text: "16",
      onClick: () =>
        setOptions({
          ...options,
          style: {
            ...(options?.style ?? {}),
            fontSize: "text-base",
          },
        }),
    },
    {
      isApplied: options.style.fontSize === "text-lg",
      text: "18",
      onClick: () =>
        setOptions({
          ...options,
          style: {
            ...(options?.style ?? {}),
            fontSize: "text-lg",
          },
        }),
    },
    {
      isApplied: options.style.fontSize === "text-xl",
      text: "20",
      onClick: () =>
        setOptions({
          ...options,
          style: {
            ...(options?.style ?? {}),
            fontSize: "text-xl",
          },
        }),
    },
    {
      isApplied: options.style.fontSize === "text-2xl",
      text: "24",
      onClick: () =>
        setOptions({
          ...options,
          style: {
            ...(options?.style ?? {}),
            fontSize: "text-2xl",
          },
        }),
    },
    {
      isApplied: options.style.fontSize === "text-3xl",
      text: "30",
      onClick: () =>
        setOptions({
          ...options,
          style: {
            ...(options?.style ?? {}),
            fontSize: "text-3xl",
          },
        }),
    },
  ];
  const fontSizeAuto = {
    isApplied: !options.style.fontSize || options.style.fontSize === "",
    text: "Auto",
    onClick: () =>
      setOptions({
        ...options,
        style: {
          ...(options?.style ?? {}),
          fontSize: "",
        },
      }),
  };
  return (
    <ContextMenu>
      <div className="relative">
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <CheckboxItem {...CheckboxItemOptions("mcq")}>Quiz</CheckboxItem>
          <CheckboxItem {...CheckboxItemOptions("attention")}>
            Attention Getter
          </CheckboxItem>
          {/* <CheckboxItem {...CheckboxItemOptions("summary")}>
            Section Summary
          </CheckboxItem> */}
          <CheckboxItem {...CheckboxItemOptions("cliffhanger")}>
            Cliff hanger
          </CheckboxItem>
          <ContextMenuSeparator />
          <CheckboxItem {...CheckboxItemStyleOptions("bold")}>
            Bold
          </CheckboxItem>
          <CheckboxItem {...CheckboxItemStyleOptions("italics")}>
            Italics
          </CheckboxItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger inset>Font size</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              {fontSizes.map(({ isApplied, onClick, text }, i) => (
                <ContextMenuCheckboxItem
                  key={i}
                  checked={isApplied}
                  onClick={onClick}
                >
                  {text}
                </ContextMenuCheckboxItem>
              ))}
              <ContextMenuSeparator />
              <ContextMenuCheckboxItem
                checked={fontSizeAuto.isApplied}
                onClick={fontSizeAuto.onClick}
              >
                {fontSizeAuto.text}
              </ContextMenuCheckboxItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </div>
    </ContextMenu>
  );
};

const AddLink = ({
  onAddLink,
}: {
  onAddLink: (link: { href: string; text: string }) => void;
}) => {
  const [open, setOpen] = useState(false);

  const hrefInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const addLink = () => {
    const newHref = hrefInputRef.current?.value ?? "";
    const newText = textInputRef.current?.value ?? "";

    if (newHref.trim() !== "" && newText.trim() !== "") {
      onAddLink({ href: newHref, text: newText });
      if (hrefInputRef.current) hrefInputRef.current.value = "";
      if (textInputRef.current) textInputRef.current.value = "";
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-6 flex-grow p-0 text-center text-primary hover:text-primary/90"
          onClick={() => setOpen(true)}
        >
          Add Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Link</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="href" className="text-right">
              URL (href)
            </Label>
            <Input id="href" ref={hrefInputRef} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text" className="text-right">
              Text
            </Label>
            <Input id="text" ref={textInputRef} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => addLink()}>
            Add Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AddImage = ({
  onAddImage,
}: {
  onAddImage: (image: { src: string; alt?: string }) => void;
}) => {
  const [open, setOpen] = useState(false);
  const srcInputRef = useRef<HTMLInputElement>(null);
  const altInputRef = useRef<HTMLInputElement>(null);

  const addImage = () => {
    const newSrc = srcInputRef.current?.value ?? "";
    const newAlt = altInputRef.current?.value ?? "";

    if (newSrc.trim() !== "") {
      onAddImage({
        src: newSrc,
        alt: newAlt,
      });
      if (srcInputRef.current) srcInputRef.current.value = "";
      if (altInputRef.current) altInputRef.current.value = "";
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-6 flex-grow p-0 text-center text-secondary hover:text-secondary/90"
          onClick={() => setOpen(true)}
        >
          Add Image
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Link</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="src" className="text-right">
              image URL (src)
            </Label>
            <Input id="src" ref={srcInputRef} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="alt" className="text-right">
              alternative text (alt)
            </Label>
            <Input id="alt" ref={altInputRef} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => addImage()}>
            Add Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
type Link = { id: number; href: string; text: string };
type Image = { id: number; src: string; alt?: string };
const WithAddBelow = ({ children }: { children: ReactNode }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  const removeLink = (id: number) => setLinks(links.filter((l) => l.id !== id));
  const onAddLink = (link: { href: string; text: string }) => {
    if (link.href && link.text) {
      setLinks((prevLinks) => [
        ...prevLinks,
        { id: prevLinks.length, ...link },
      ]);
    }
  };

  const removeImage = (id: number) =>
    setImages(images.filter((i) => i.id !== id));
  const onAddImage = (image: { src: string; alt?: string }) => {
    if (image.src) {
      setImages((prevImages) => [
        ...prevImages,
        { id: prevImages.length, ...image },
      ]);
    }
  };

  return (
    <>
      <div className="group">
        {children}
        <div className="invisible relative ml-auto flex w-full flex-grow text-center group-hover:visible">
          <AddLink onAddLink={onAddLink} />
          <AddImage onAddImage={onAddImage} />
        </div>
      </div>

      {images.length > 0 && (
        <div>
          {images.map(({ id, src, alt }) => (
            <div className="group relative" key={id}>
              <img {...{ src, alt }} width={520} />

              <div className="invisible absolute right-0 top-0 ml-auto h-full text-sm group-hover:visible">
                <X
                  onClick={(e) => {
                    e.preventDefault();
                    removeImage(id);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {links.length > 0 && (
        <ul className="mb-4 ml-6 list-[decimal]">
          {links.map(({ id, href, text }) => (
            <li
              key={id}
              className="group text-blue-600 visited:text-purple-600"
            >
              <a href={href} className="flex">
                {text}
                <div className="invisible relative ml-auto h-full text-sm group-hover:visible">
                  <X
                    onClick={(e) => {
                      e.preventDefault();
                      removeLink(id);
                    }}
                  />
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

const Editor = ({
  id,
  content,
  generated,
  setSections,
}: {
  id?: string;
  content: Partial<NewsletterFormData>;
  generated?: Generated;
  setSections?: (sections: NewsletterFormData["sections"]) => void;
}) => {
  const { mutate } = api.newsletters.edit.useMutation({
    onSuccess: (newsletter) => {
      if (newsletter?.content) {
        // setcontent(newsletter?.content as Partial<NewsletterFormData>);
      }
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors?.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to save! Please try again later.");
      }
    },
  });

  const saveArticleContent = (
    sid: number,
    aid: number,
    textOptions: ArticleTextOptions,
    content: Partial<NewsletterFormData>
  ) => {
    const newArticles =
      content?.sections?.[sid]?.articles.map((article, id) =>
        id === aid ? { ...article, textOptions } : article
      ) ?? [];
    const newSections =
      content?.sections?.map((s, id) =>
        id === sid ? { ...s, articles: newArticles } : s
      ) ?? [];

    const newContent = {
      ...content,
      sections: newSections,
    };

    if (id) {
      mutate({
        id,
        content: JSON.stringify(newContent),
        generated: generated && JSON.stringify(generated),
      });
    } else {
      if (setSections) {
        setSections(newSections);
      }
    }
  };
  return (
    // <div className="preview flex min-h-[350px] w-full flex-col p-8 text-black lg:min-h-[650px]">
    <div className="preview flex max-h-[650px] w-full flex-col overflow-scroll p-8 text-black">
      {content?.title && (
        <h1 className="mb-2 scroll-m-20 whitespace-break-spaces text-4xl font-extrabold tracking-tight">
          {content?.title}
        </h1>
      )}
      {content?.introductoryParagraph && (
        <p className="my-2 mt-3 whitespace-break-spaces break-words  leading-7 first:mt-0">
          {content?.introductoryParagraph}
        </p>
      )}
      {generated?.shouldGenarateSummary && (
        <WithAddBelow>
          <p className="mt-2 whitespace-break-spaces  bg-gray-200 p-2 text-lg font-medium text-foreground first:mt-0">
            {shouldGenerateSummaryText}
          </p>
        </WithAddBelow>
      )}
      {content?.sections?.map((section, sid) =>
        section.articles.map((article, aid) => (
          <WithAddBelow key={`s${sid}a${aid}`}>
            <EditorArticle
              key={`s${sid}a${aid}`}
              parsedArticle={generated?.parsedSections?.[`s${sid}a${aid}`]}
              article={article}
              updateTextOptionsForArticle={(textOptions) =>
                saveArticleContent(sid, aid, textOptions, content)
              }
              generatedArticle={generated?.sections?.[sid]?.articles?.[aid]}
            />
          </WithAddBelow>
        ))
      )}
    </div>
  );
};

export default Editor;
