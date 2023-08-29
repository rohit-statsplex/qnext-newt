import type { PropsWithChildren } from "react";
import Footer from "./components/footer";

export const PageLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="md:hidden">
        <div className="flex h-screen flex-col items-center justify-center">
          <div className="text-2xl">Please, use a larger screen</div>
          <div>You can request desktop site from your browser</div>
        </div>
      </div>
      <div className="hidden h-screen flex-col justify-center md:flex">
        <main className="flex-1">
          <div className="container flex h-full w-full flex-col justify-center">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};
