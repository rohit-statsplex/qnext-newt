import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { type NewsletterFormData } from "../NewsletterLiveForm/schemas";
import { type RouterOutputs } from "~/utils/api";
import Link from "next/link";
import { type SyntheticEvent } from "react";

dayjs.extend(relativeTime);

type NewsletterWithUser = RouterOutputs["newsletters"]["getAll"][number];
export const NewsletterCard = ({
  newsletter,
  // author,
  onClick,
}: {
  newsletter?: NewsletterWithUser["newsletter"];
  // author,
  onClick: (event: SyntheticEvent<Element, Event>) => void;
}) => {
  if (!newsletter) {
    return (
      <div className="duration-[0.1s] ease-[ease-in] relative top-0 flex min-h-full flex-col no-underline shadow-[0_2px_5px_rgba(0,0,0,0.1)] transition-all hover:-top-0.5 hover:shadow-[0_4px_5px_rgba(0,0,0,0.2)]">
        <div
          className="bg-white bg-cover bg-[top_center] pb-[60%]"
          onClick={onClick}
        />
        <article className="flex flex-1 flex-col justify-between p-3">
          <h1 className="h-[24px]" onClick={onClick}></h1>
        </article>
      </div>
    );
  }
  const content = JSON.parse(newsletter?.content ?? "{}") as NewsletterFormData;
  const title = content.title ?? "";
  const timeFromNow = dayjs(newsletter?.updatedAt).fromNow();
  // const authorName = author.username;

  return (
    <div className="duration-[0.1s] ease-[ease-in] relative top-0 flex min-h-full flex-col no-underline shadow-[0_2px_5px_rgba(0,0,0,0.1)] transition-all hover:-top-0.5 hover:shadow-[0_4px_5px_rgba(0,0,0,0.2)]">
      <div
        className="bg-cover bg-[top_center] pb-[60%]"
        style={{
          backgroundImage: `url("/images/dummy-newsletter-icon.png")`,
          // "url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/flex-1.jpg)",
        }}
        onClick={onClick}
      />
      <article className="flex flex-1 flex-col justify-between p-3">
        <h1 onClick={onClick}>{title}</h1>
        {/* <span>{authorName}</span> */}
        <div className="flex items-end justify-between">
          <span>{timeFromNow}</span>
          <Link
            href={`/newletters/${newsletter.id}/edit?step=3`}
            className="text-sm"
            aria-label="Edit"
          >
            Edit
          </Link>
        </div>
      </article>
    </div>
  );
};
