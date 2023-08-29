import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import NewsletterLiveForm from "~/components/NewsletterLiveForm/newsletterForm";
import {
  type Generated,
  type NewsletterFormData,
} from "~/components/NewsletterLiveForm/schemas";

const SingleNewsletterPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.newsletters.getById.useQuery({
    id,
  });
  if (!data) return <div>404</div>;
  let newsletterData: Partial<NewsletterFormData> = {}; //defaultNewsletterData;
  try {
    newsletterData = {
      // ...defaultNewsletterData,
      ...JSON.parse(data?.newsletter?.content),
    } as NewsletterFormData;
  } catch (error) {
    console.log(` could not parse ${data?.newsletter?.content}`);
  }
  return (
    <>
      <Head>
        <title>{`${newsletterData?.title ?? "No Newsletter Found"}`}</title>
      </Head>
      <NewsletterLiveForm
        id={id}
        newsletter={newsletterData}
        generated={JSON.parse(data?.newsletter?.generated) as Generated}
      />
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
