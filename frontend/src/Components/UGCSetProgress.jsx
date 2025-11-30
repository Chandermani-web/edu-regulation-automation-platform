import React from "react";

const UGCStepProgress = ({ active = 1 }) => {
  const steps = [
    { id: 1, title: "Application Review", sub: "Review full details" },
    { id: 2, title: "Parameter Verification", sub: "Verify all parameters" },
    { id: 3, title: "Document Verification", sub: "Check institution documents" },
    { id: 4, title: "Query Management", sub: "Communicate with institution" },
    { id: 5, title: "Review Posting", sub: "Submit expert review" },
    { id: 6, title: "AI Analysis", sub: "Check AI & human comparison" },
    { id: 7, title: "Final Approval", sub: "Approve / Reject / Revise" },
  ];

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow border">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6 text-center">

        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">

            {/* circle */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold
                ${
                  step.id === active
                    ? "bg-green-600"
                    : "bg-gray-300 text-gray-700"
                }
              `}
            >
              {step.id}
            </div>

            {/* title */}
            <p
              className={`mt-2 font-semibold ${
                step.id === active ? "text-green-700" : "text-gray-700"
              }`}
            >
              {step.title}
            </p>

            {/* subtitle */}
            <p className="text-gray-400 text-sm">{step.sub}</p>
          </div>
        ))}

      </div>
    </div>
  );
};

export default UGCStepProgress;
