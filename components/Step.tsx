import React from "react";

type Step = {
  label: string;
};

type StepProps = {
  steps: Step[];
  orientation?: "horizontal" | "vertical";
};

export const Step: React.FC<StepProps> = ({
  steps,
  orientation = "horizontal",
}) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={`flex ${
        isHorizontal ? "flex-row items-center" : "flex-col items-start"
      } gap-4 justify-center`}
    >
      {steps.map((step, index) => (
        <div
          key={index}
          className={`flex ${
            isHorizontal ? "flex-col items-center" : "flex-row items-start"
          } gap-2`}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-primary">
              {index + 1}
            </div>
            {!isHorizontal && index !== steps.length - 1 && (
              <div className="w-1 h-6 bg-blue-200 ml-3"></div>
            )}
          </div>
          <div className="text-sm text-secondary-foreground">{step.label}</div>
        </div>
      ))}
    </div>
  );
};
