/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import {
  useForm,
  useFieldArray,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { PageLayout } from "../layouts/newslettersLayout";

import { onPromise } from "~/lib/utils";
import { api } from "~/utils/api";
import {
  type NewsletterFormData,
  defaultNewSection,
  validateTitle,
  MAX_SECTION_COUNT,
  newsletterformSchema,
  type GeneratedArticle,
  defaultGeneratedSection,
  type NonGeneratedSections,
  Generated,
} from "./schemas";
import { Section } from "./section";
import { filterNonGeneratedSections } from "./utils";
import { X as XIcon } from "lucide-react";
import NewsletterPreview from "./newsletterPreview";
import { Step } from "./step";
import { useParseGenerateSections } from "~/hooks/useParseGenerateSections";
import { GeneratedProvider, useGenerated } from "../../hooks/generatedProvider";

const NestedForm = ({
  generated: defaultGenerated,
  id,
}: {
  id?: string;
  generated?: Generated;
}) => {
  const { generated, setGenerated } = useGenerated();
  const [nonGeneratedSections, setNonGeneratedSections] =
    useState<NonGeneratedSections>([]);
  useEffect(() => {
    defaultGenerated && setGenerated(defaultGenerated);
  }, [defaultGenerated]);
  const router = useRouter();
  const { step } = router.query;
  const activeStep = typeof step === "string" ? parseInt(step) : 1;
  const setStep = async (step: number) => {
    router.query.step = step.toString();
    await router.push(router);
  };
  const [activeSection, setActiveSection] = useState("0");

  const { handleSubmit, control, watch, trigger, setValue } =
    useFormContext<NewsletterFormData>();
  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: "sections",
  });
  const addASection = () => {
    appendSection(defaultNewSection);
    const newGeneratedSection = defaultGeneratedSection;
    setGenerated({
      ...generated,
      sections: [...generated.sections, newGeneratedSection],
    });
    const sectionCount = sectionFields?.length;
    setValue("numberOfSections", (sectionCount + 1).toString());
  };

  const removeASection = (sectionIndex: number) => {
    if (sectionFields?.length > 1) {
      removeSection(sectionIndex);
      setGenerated({
        ...generated,
        sections: generated.sections.filter((_s, sid) => sid === sectionIndex),
      });
      setValue("numberOfSections", (sectionFields?.length - 1).toString());
      const newActiveSection =
        parseInt(activeSection) === 0 ? 0 : parseInt(activeSection) - 1;
      setActiveSection(newActiveSection.toString());
    }
  };

  const nextSection = (parseInt(activeSection) + 1) % sectionFields?.length;
  const gotoNextSection = () => setActiveSection(nextSection.toString());

  const watchAllFields = watch();
  const title = watchAllFields.title;
  const isTitleUsableForGenerate = useRef<boolean>();
  useEffect(() => {
    isTitleUsableForGenerate.current = validateTitle(title);
  }, [title]);

  const setGeneratedSectionBySId = (
    articles: GeneratedArticle[],
    sectionId: number
  ) => {
    console.log(generated, articles, sectionId, "asd");

    setGenerated({
      ...(generated ?? {}),
      sections: generated?.sections?.map((section, sid) =>
        sectionId === sid ? { ...section, articles } : section
      ) ?? [{ articles }],
    });
  };

  const handleNext = onPromise(async () => {
    let isValid = false;
    switch (activeStep) {
      case 1:
        isValid = await trigger([
          "title",
          "introductoryParagraph",
          "numberOfSections",
        ]);
        break;
      case 2:
        isValid = await trigger(["sections"]);
        const nonGeneratedSectionArticlesWithSectionIndex =
          filterNonGeneratedSections(
            watchAllFields?.sections,
            generated.sections
          );
        if (nonGeneratedSectionArticlesWithSectionIndex?.length > 0) {
          setNonGeneratedSections(nonGeneratedSectionArticlesWithSectionIndex);
        }
        break;
    }
    // form.submit()
    if (isValid) {
      await setStep(activeStep + 1);
    }
  });

  const generatedFromNonGeneratedSectionsQueries = useParseGenerateSections(
    activeStep !== 3 ? nonGeneratedSections : []
  );
  const allSectionsSuccess = generatedFromNonGeneratedSectionsQueries.every(
    (g) => g.status === "success"
  );
  useEffect(() => {
    if (allSectionsSuccess) {
      const generatedSectionsWithIds =
        generatedFromNonGeneratedSectionsQueries?.map((q) => q.data);
      generatedSectionsWithIds?.map((s) => {
        if (s?.articles) {
          setGeneratedSectionBySId(s?.articles, s?.sectionIndex);
        }
      });
    }
  }, [allSectionsSuccess]);

  const ctx = api.useContext();
  const { push } = useRouter();

  const { mutate, isLoading } = api.newsletters.create.useMutation({
    onSuccess: async (newsletter) => {
      void ctx.newsletters.getAll.invalidate();
      toast.success("Newsletter Created");
      await push(`/newletters/${newsletter?.id}`);
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

  const onSubmit = onPromise(
    handleSubmit(() => {
      mutate({
        content: JSON.stringify(watchAllFields),
        generated: JSON.stringify(generated),
      });
    })
  );

  const anySectionsLoading = generatedFromNonGeneratedSectionsQueries.some(
    (g) => g.status === "loading"
  );
  // console.log("generatle2", ...generated.sections.map(s => s.articles?.map(a => a.status)));
  return (
    <form className="flex grow flex-col" onSubmit={onSubmit}>
      {
        <div className="flex grow items-start gap-4">
          {activeStep === 1 && (
            <div className="flex h-full w-1/2 flex-1 flex-col">
              <Step onForwardClick={handleNext} isFirstStep>
                <FormField
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-4 rounded border bg-white p-6">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the Newsletter Title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>&nbsp;</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="introductoryParagraph"
                  render={({ field }) => (
                    <FormItem className="space-y-4 rounded border bg-white p-6">
                      <FormLabel>Introductory Paragraph</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the welcome message"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="flex flex-col items-center space-y-4">
                        <div className="pt-6 ">
                          <span className="text-xl font-bold ">--- OR ---</span>
                        </div>
                        <div>
                          <Button
                            type="button"
                            onClick={() => {
                              setGenerated({
                                ...generated,
                                shouldGenarateSummary:
                                  !generated.shouldGenarateSummary,
                              });
                            }}
                            disabled={!isTitleUsableForGenerate.current}
                          >
                            {generated.shouldGenarateSummary
                              ? `Don't Generate Summaries`
                              : "Generate Summaries"}
                          </Button>
                        </div>
                        <FormDescription>
                          {!isTitleUsableForGenerate.current &&
                            "Introductory Paragraph can be generated after you enter the Title"}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="numberOfSections"
                  render={({ field }) => (
                    <FormItem className="space-y-4 rounded border bg-white p-6">
                      <div className="flex items-center space-x-6">
                        <FormLabel className="min-w-[185px]">
                          Number of Sections/Topics
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            setValue(
                              "sections",
                              new Array(Number(value))
                                .fill(0)
                                .map(() => defaultNewSection)
                            );
                            setGenerated({
                              ...generated,
                              sections: new Array(Number(value))
                                .fill(0)
                                .map(() => defaultGeneratedSection),
                            });
                            field.onChange(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a number of sections in the newletters" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {new Array(MAX_SECTION_COUNT)
                              .fill(0)
                              .map((_, idx) => (
                                <SelectItem
                                  key={idx + 1}
                                  value={(idx + 1).toString()}
                                >
                                  {idx + 1}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Step>
            </div>
          )}
          {activeStep === 2 && (
            <div className="flex h-full w-1/2 flex-1 flex-col">
              <Step
                onBackClick={onPromise(async () => await setStep(1))}
                onForwardClick={handleNext}
              >
                <Tabs
                  value={activeSection}
                  onValueChange={(value) => setActiveSection(value)}
                >
                  <TabsList className="ml-2 p-0">
                    {sectionFields?.map((sectionField, sectionIndex) => (
                      <TabsTrigger
                        className="box-border flex rounded-t-lg border-x border-t bg-accent outline-none data-[state=active]:bg-white"
                        key={sectionField.id}
                        value={sectionIndex.toString()}
                      >
                        Section {sectionIndex + 1}
                        <XIcon
                          className="pl-2 pr-0"
                          onClick={() => removeASection(sectionIndex)}
                        />
                      </TabsTrigger>
                    ))}
                    <Button
                      className="flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                      type="button"
                      variant="ghost"
                      onClick={addASection}
                      disabled={sectionFields?.length >= MAX_SECTION_COUNT}
                    >
                      Add Section
                    </Button>
                  </TabsList>
                  {sectionFields.map((sectionField, sectionIndex) => (
                    <TabsContent
                      key={sectionField.id}
                      value={sectionIndex.toString()}
                      className="m-0 space-y-4 rounded border bg-white p-6"
                    >
                      <Section
                        sectionIndex={sectionIndex}
                        setGeneratedSection={(articles) =>
                          setGeneratedSectionBySId(
                            articles.map((a) => ({
                              ...a,
                              status: "success",
                            })),
                            sectionIndex
                          )
                        }
                        hideNextSection={nextSection === 0}
                        gotoNextSection={gotoNextSection}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </Step>
            </div>
          )}
          {activeStep === 3 ? (
            <div className="flex h-full flex-1 flex-col">
              {/* <h2>No generated step 3</h2> */}
              <Step
                onBackClick={onPromise(async () => await setStep(2))}
                onForwardClick={handleNext}
                isForwardDisabled={isLoading}
                isLastStep
              >
                <NewsletterPreview
                  id={id}
                  setSections={(sections: NewsletterFormData["sections"]) => {
                    setValue("sections", sections);
                  }}
                  isDataEmpty={watchAllFields?.title === ""}
                  newsletter={watchAllFields}
                  generated={generated}
                />
              </Step>
            </div>
          ) : (
            <div className="flex h-full w-1/2 flex-1 flex-col">
              {/* <h2>if not step 3</h2> */}
              <NewsletterPreview
                id={id}
                isDataEmpty={watchAllFields?.title === ""}
                newsletter={watchAllFields}
                setSections={(sections: NewsletterFormData["sections"]) => {
                  setValue("sections", sections);
                }}
                generated={generated}
              />
            </div>
          )}
        </div>
      }
      {anySectionsLoading && <div className="absolute">Loading...</div>}
    </form>
  );
};

function NewsletterLiveForm({
  id,
  newsletter,
  generated,
}: {
  id?: string;
  newsletter?: Partial<NewsletterFormData>;
  generated?: Generated;
}) {
  const hasNewsletterProp = !!newsletter?.title;
  const methods = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterformSchema),
    defaultValues: hasNewsletterProp
      ? newsletter
      : {
          numberOfSections: "1",
          sections: [defaultNewSection],
        },
  });

  return (
    <PageLayout>
      <FormProvider {...methods}>
        <GeneratedProvider>
          <NestedForm generated={generated} id={id} />
        </GeneratedProvider>
      </FormProvider>
    </PageLayout>
  );
}

export default NewsletterLiveForm;
