import { SignOutButton, useUser, UserButton } from "@clerk/nextjs";
import type { PropsWithChildren, ReactNode } from "react";

import NewtLogo from "../molecules/logos/newt";
import Footer from "./components/footer";
import type { NextPage } from "next";
import Link from "next/link";

export const Header = () => {
  const { isSignedIn, user } = useUser();

  return (
    <div className="container mt-4 flex h-20 flex-row-reverse items-center justify-between">
      <div className="px-1 hover:bg-accent hover:text-accent-foreground">
        {isSignedIn && (
          <UserButton />
          // <span>
          //   <Link href={"/"}>{user.fullName ?? user.username}</Link> (
          //   <span>
          //     <SignOutButton />
          //   </span>
          //   )
          // </span>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <Link href={"/"}>
          <NewtLogo />
        </Link>
      </div>
    </div>
  );
};

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <div>
      <div className="md:hidden">
        <div className="flex h-screen flex-col items-center justify-center">
          <div className="text-2xl">Please, use a larger screen</div>
          <div>You can request desktop site from your browser</div>
        </div>
      </div>
      <div className="justify-center/> hidden h-screen flex-col md:flex">
        <Header />
        <div className="container my-4 flex grow flex-col justify-center gap-8">
          {props.children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

type PreviewPaneLayoutProps = {
  left?: ReactNode;
  right?: ReactNode;
};

export const PreviewPaneLayout: NextPage<PreviewPaneLayoutProps> = ({
  left,
  right,
}) => (
  <PageLayout>
    <div className="flex h-full items-start gap-4">
      <div className="h-full w-1/2">{left}</div>
      <div className="h-full w-1/2">{right}</div>
    </div>
  </PageLayout>
);

export const PreviewPaneWithNewsletterLayout = ({
  stepComponent,
  newsletterPreviewComponent,
}: {
  stepComponent: ReactNode;
  newsletterPreviewComponent: ReactNode;
}) => (
  <PreviewPaneLayout
    left={
      <div className="flex h-full w-full flex-col items-stretch">
        <div className="h-full items-start pt-8">{stepComponent}</div>
      </div>
    }
    right={
      <div className="flex h-full w-full flex-col items-stretch">
        <p className="pb-2">Preview Pane</p>
        {newsletterPreviewComponent}
      </div>
    }
  />
);
