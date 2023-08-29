import { type SyntheticEvent } from "react";
import { Button } from "../ui/button";

type StepProps = {
  children: React.ReactNode;
  onForwardClick?: (event: SyntheticEvent<Element, Event>) => void;
  onBackClick?: (event: SyntheticEvent<Element, Event>) => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isForwardDisabled?: boolean;
};
export const Step: React.FC<StepProps> = ({
  children,
  isFirstStep = false,
  isLastStep = false,
  isForwardDisabled = false,
  onForwardClick,
  onBackClick,
}) => (
  <div className="flex flex-col space-y-8">
    <div className="flex grow flex-col space-y-8">
      <>{children}</>
    </div>
    <div className="flex justify-between">
      <div className="">
        {!isFirstStep && (
          <Button type="button" onClick={onBackClick}>
            Back
          </Button>
        )}
      </div>
      <div className="">
        <Button
          {...(isLastStep
            ? { type: "submit" }
            : { type: "button", onClick: onForwardClick })}
          disabled={isForwardDisabled}
        >
          {isLastStep ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  </div>
);
