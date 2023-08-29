import Head from "next/head";
import { PageLayout } from "~/components/layouts/newslettersLayout";

const ProfilePage = () => {
  return (
    <>
      <Head>
        <title>Newt: 404</title>
      </Head>
      <PageLayout>
        <div>404</div>
      </PageLayout>
    </>
  );
};

// export const getStaticProps: GetStaticProps = async (context) => {
//   const ssg = generateSSGHelper();

//   const slug = context.params?.slug;

//   if (typeof slug !== "string") throw new Error("no slug");

//   const username = slug.replace("@", "");

//   await ssg.profile.getUserByUsername.prefetch({ username });

//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       username,
//     },
//   };
// };

// export const getStaticPaths = () => {
//   return { paths: [], fallback: "blocking" };
// };

export default ProfilePage;
