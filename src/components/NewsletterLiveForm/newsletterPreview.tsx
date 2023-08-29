import Link from "next/link";
import Editor from "./editor";
import { type Generated, type NewsletterFormData } from "./schemas";
import { Link as LinkIcon } from "lucide-react";

const NewsletterPreview = ({
  isDataEmpty = false,
  newsletter,
  generated,
  id,
  setSections,
}: {
  isDataEmpty?: boolean;
  newsletter: Partial<NewsletterFormData>;
  generated?: Generated;
  id?: string;
  setSections?: (sections: NewsletterFormData["sections"]) => void;
}) => (
  <div className="relative flex grow flex-col overflow-auto rounded border bg-accent">
    <div className="m-auto min-h-full w-full max-w-[600px] bg-white">
      {isDataEmpty ? (
        <div className="flex h-full w-full flex-col items-center justify-center">
          Preview
        </div>
      ) : (
        <Editor
          id={id}
          content={newsletter}
          generated={generated}
          setSections={setSections}
        />
      )}
    </div>
    {id && (
      <div className="absolute inset-0 bottom-auto flex justify-between">
        <Link
          href={`/newletters/${id}/edit`}
          className="flex p-2"
          aria-label="Edit"
        >
          Edit <LinkIcon className="ml-2 w-4" />
        </Link>
        <Link
          href={`/newletters/${id}/edit?step=3`}
          className="flex p-2"
          aria-label="Open in Editor"
        >
          Open in Editor <LinkIcon className="ml-2 w-4" />
        </Link>
      </div>
    )}
  </div>
);

export default NewsletterPreview;
