import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "../ui/button";
import { PageLayout, PreviewPaneLayout } from "../layouts/newslettersLayout";
import { type RouterOutputs, api } from "~/utils/api";
import { LoadingPage } from "../loading";
import {
  type Generated,
  type NewsletterFormData,
} from "../NewsletterLiveForm/schemas";
import { useState } from "react";
import { NewsletterCard } from "./NewsletterCard";
import NewsletterPreview from "../NewsletterLiveForm/newsletterPreview";
import { onPromise } from "~/lib/utils";

type NewsletterWithUser = RouterOutputs["newsletters"]["getAll"][number];

export const NewslettersFeed = () => {
  const router = useRouter();
  const [selectedNewsletterIdx, setSelectedNewsletterIdx] = useState(0);
  const { data, isLoading } = api.newsletters.getAll.useQuery();

  if (isLoading)
    return (
      <PageLayout>
        <div className="flex grow">
          <LoadingPage />
        </div>
      </PageLayout>
    );

  if (!data) return <PageLayout>Something went wrong</PageLayout>;

  if (data?.length === 0) {
    return (
      <PageLayout>
        <div>no Newsletters</div>
        <div className="flex flex-1 items-center justify-center p-4 text-xl">
          <Button asChild>
            <Link href="/newletters/new">Start a New Newsletter</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const selectedNewsletter = data?.[selectedNewsletterIdx];
  if (selectedNewsletter) {
    const newsletter = JSON.parse(
      selectedNewsletter?.newsletter.content ?? "{}"
    ) as NewsletterFormData;
    // console.log(selectedNewsletter?.newsletter?.generated, "generated");

    const generated =
      typeof selectedNewsletter?.newsletter?.generated === "string"
        ? (JSON.parse(selectedNewsletter.newsletter.generated) as Generated)
        : undefined;
    const newsletterIndex = selectedNewsletter?.newsletter.id;
    return (
      <PreviewPaneLayout
        left={
          <>
            {data?.length > 0 ? (
              <div className="flex h-full w-full flex-col">
                <div className="relative">
                  <div className="h-[calc(100vh-535px)] min-h-[400px] overflow-auto">
                    <div className="mx-auto my-0 grid w-full max-w-[660px] grid-cols-[1fr] grid-rows-[auto] gap-4 overflow-auto lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1fr_1fr]">
                      {data?.map(
                        (newsletterWithUser: NewsletterWithUser, i) => (
                          <NewsletterCard
                            onClick={() => setSelectedNewsletterIdx(i)}
                            {...newsletterWithUser}
                            key={newsletterWithUser.newsletter.id}
                          />
                        )
                      )}
                    </div>
                  </div>
                  {newsletterIndex && (
                    <>
                      <div className="my-4 h-[40px]"></div>
                      <div className="absolute bottom-0 left-0 right-0 mx-auto flex items-center justify-center gap-4">
                        <Link href={`/newletters/${newsletterIndex}/edit`}>
                          <Button
                            aria-label="create newsletter"
                            className={"w-[200px] justify-center"}
                          >
                            Edit
                          </Button>
                        </Link>
                        <Link
                          href={`/newletters/${newsletterIndex}/edit?step=3`}
                        >
                          <Button
                            aria-label="create newsletter"
                            className={"w-[200px] justify-center"}
                          >
                            Open in Editor
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-4 p-4">
                  <div className="mx-auto my-0 grid w-full max-w-[660px] grid-cols-[1fr] grid-rows-[auto] gap-4 overflow-auto lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1fr_1fr]">
                    <div />
                    <NewsletterCard
                      onClick={onPromise(async (e) => {
                        e.preventDefault();
                        await router.push("/newletters/new");
                      })}
                    />
                    <div />
                  </div>
                  <div className="flex items-center justify-center">
                    <Link href={`/newletters/new`} className="p-4">
                      <Button
                        aria-label="create newsletter"
                        className={"w-[200px] justify-center"}
                      >
                        Create Newsletter
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Link href="/newletters/new" className="p-4">
                  <Button
                    aria-label="create newsletter"
                    className={"w-[200px] justify-center"}
                  >
                    Create Newsletter
                  </Button>
                </Link>
              </div>
            )}
          </>
        }
        right={
          <div className="flex h-full flex-col">
            <p>Preview Pane</p>
            {selectedNewsletterIdx === -1 ? (
              <div className="my-2 flex flex-1 items-center justify-center rounded-lg border bg-white text-xl">
                <Image
                  src="/images/previewPane.png"
                  alt="Preview Pane"
                  width={500}
                  height={679.78}
                />
              </div>
            ) : (
              data.length > 0 && (
                <NewsletterPreview
                  {...{
                    newsletter,
                    generated,
                    id: newsletterIndex,
                  }}
                />
              )
            )}
          </div>
        }
      />
    );
  }

  return <>No selected Newsletter...</>;
};
