// StepProgress.jsx - Updated with government styling
import React from "react";
import { Check } from "lucide-react";

const StepProgress = ({ currentStep }) => {
  const steps = [
    {
      id: 1,
      title: "Institution Profile",
      description: "Add institution basic details",
    },
    {
      id: 2,
      title: "Parameters Entry",
      description: "Fill academic & infra parameters",
    },
    {
      id: 3,
      title: "Document Upload",
      description: "Upload mandatory documents",
    },
    {
      id: 4,
      title: "Application Submission",
      description: "Review & submit application",
    },
  ];

  return (
    <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
      <h3 className="font-semibold text-gray-900 mb-6 text-lg">Application Progress</h3>
      
      <div className="space-y-6">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = step.id < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex gap-4">
              {/* Step connector line */}
              {!isLast && (
                <div className="absolute left-7 mt-10 w-0.5 h-8 bg-gray-200">
                  {isCompleted && (
                    <div className="w-0.5 h-full bg-blue-600"></div>
                  )}
                </div>
              )}

              {/* Step number/icon */}
              <div className="relative z-10">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors ${
                    isActive
                      ? "bg-blue-600 border-blue-600 text-white"
                      : isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-300 text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={18} />
                  ) : (
                    <span className="font-medium">{step.id}</span>
                  )}
                </div>
              </div>

              {/* Step content */}
              <div className="flex-1 pb-6">
                <p
                  className={`font-medium ${
                    isActive || isCompleted
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;