import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { PageLayout } from "~/components/layouts/newslettersLayout";
import NewsletterPreview from "~/components/NewsletterLiveForm/newsletterPreview";
import {
  type Generated,
  type NewsletterFormData,
} from "~/components/NewsletterLiveForm/schemas";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuTrigger,
// } from "~/components/ui/dropdown-menu";

type StepProps = {
  children: React.ReactNode;
  forwardBtn: React.ReactNode;
  backBtn: React.ReactNode;
  actiondBtn: React.ReactNode;
};
export const Step: React.FC<StepProps> = ({
  children,
  forwardBtn,
  backBtn,
  actiondBtn,
}) => (
  <>
    <div className="flex flex-1">
      <>{children}</>
    </div>
    <div className="flex justify-around">
      <div className="">{backBtn}</div>
      <div className="">{forwardBtn}</div>
      <div className="">{actiondBtn}</div>
    </div>
  </>
);

const SingleNewsletterPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.newsletters.getById.useQuery({
    id,
  });
  if (!data) return <div>404</div>;
  let newsletterData: Partial<NewsletterFormData> = {}; //defaultNewsletterData
  try {
    // generated to be added
    newsletterData = {
      // ...defaultNewsletterData,
      ...(JSON.parse(data?.newsletter?.content) as NewsletterFormData),
    };
  } catch (error) {
    console.log(` could not parse ${data?.newsletter?.content}`);
  }
  // console.log(newsletterData);

  return (
    <>
      <Head>
        <title>{`${newsletterData?.title ?? "No newsletter"}`}</title>
      </Head>
      <PageLayout>
        <Step
          forwardBtn={
            <Link href={`/newletters/${data.newsletter.id}/edit`}>
              <Button>Edit</Button>
            </Link>
          }
          backBtn={
            <Link href={`/newletters`}>
              <Button>Back</Button>
            </Link>
          }
          actiondBtn={
            <Button className="bg-orange-400 hover:bg-orange-600">
              Export
            </Button>
          }
        >
          <NewsletterPreview
            id={id}
            isDataEmpty={newsletterData.title === ""}
            newsletter={newsletterData}
            generated={JSON.parse(data?.newsletter?.generated) as Generated}
          />
        </Step>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.newsletters.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SingleNewsletterPage;
