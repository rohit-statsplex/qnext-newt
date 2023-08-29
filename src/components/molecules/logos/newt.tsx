import { cn } from "~/lib/utils";

const getStyleProps = (size: string) => {
  switch (size) {
    case "nav":
      return { height: "16", font: "base" };
      break;

    default:
      return { height: "16", font: "base" };
      break;
  }
};

type NewtLogoProps = {
  size?: string;
};
const NewtLogo = ({ size = "nav" }: NewtLogoProps) => {
  const { height, font } = getStyleProps(size);

  const wrapperClass = cn(
    "relative flex items-center justify-center rounded-full bg-white",
    `h-${height} w-${height}`
  );
  const textClass = cn("text-center font-bold text-primary", `text-${font}`);
  return (
    <div className={wrapperClass}>
      <p className={textClass}>Newt</p>
    </div>
  );
};

export default NewtLogo;
