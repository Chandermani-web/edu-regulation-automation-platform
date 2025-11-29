import React from "react";

const StepProgress = ({ currentStep }) => {
  const steps = [
    { id: 1, title: "Institution Profile", description: "Add institution basic details" },
    { id: 2, title: "Parameters Entry", description: "Fill academic & infra parameters" },
    { id: 3, title: "Document Upload", description: "Upload mandatory documents" },
    { id: 4, title: "Application Submission", description: "Review & submit application" },
    { id: 5, title: "Queries", description: "Respond to UGC/AICTE queries" },
    { id: 6, title: "Reviews", description: "View review feedback" },
    { id: 7, title: "AI Analytics", description: "Track AI insights" },
    { id: 8, title: "AI Reports", description: "Download generated reports" },
  ];

  return (
    <div className="flex items-center justify-between w-full py-8 bg-white rounded-xl shadow border px-6 overflow-x-auto">

      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = step.id < currentStep;

        return (
          <div key={step.id} className="flex items-center gap-4 min-w-[160px]">

            {/* Number Circle */}
            <div
              className={`h-10 w-10 flex items-center justify-center rounded-full border-2 
              ${isActive ? "bg-green-600 text-white border-green-600"
                : isCompleted ? "bg-green-200 text-green-800 border-green-600"
                : "bg-gray-100 text-gray-500 border-gray-300"}`}
            >
              {step.id}
            </div>

            {/* Text */}
            <div>
              <p className={`font-semibold ${
                isActive ? "text-green-700" :
                isCompleted ? "text-gray-800" :
                "text-gray-500"
              }`}>
                {step.title}
              </p>
              <p className="text-sm text-gray-400">{step.description}</p>
            </div>

            {/* Line Separator (skip last) */}
            {index !== steps.length - 1 && (
              <div className="flex-1 h-[2px] bg-gray-300 mx-4"></div>
            )}
          </div>
        );
      })}

    </div>
  );
};

export default StepProgress;
