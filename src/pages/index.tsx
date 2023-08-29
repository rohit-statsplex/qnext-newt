import { SignIn, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import { PageLayout } from "~/components/layouts/newslettersLayout";
import { NewslettersFeed } from "~/components/molecules/newsletters";

const Home: NextPage = () => {
  const { isSignedIn, isLoaded } = useUser();

  // Server-render loading state
  if (!isLoaded) {
    return <PageLayout>Loading...</PageLayout>;
  }

  if (!isSignedIn) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center">
          <SignIn />
        </div>
      </PageLayout>
    );
  }

  return <NewslettersFeed />;
};

export default Home;
