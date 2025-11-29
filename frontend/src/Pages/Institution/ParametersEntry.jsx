import React from "react";
import Layout from "../../Components/Layout";
import StepProgress from "../../Components/StepProgress";
import { AlertTriangle, Save } from "lucide-react";

const ParametersEntry = () => {
  
  const parameterData = [
    {
      category: "Land Requirement",
      items: [
        { name: "Total Land Area (Rural)", norm: "7.5 Acres", authority: "AICTE", critical: "Mandatory" },
        { name: "Total Land Area (Urban/Mega City)", norm: "2.5 Acres", authority: "AICTE", critical: "Mandatory" },
        { name: "Land Continuity", norm: "Contiguous (Single Plot preferred)", authority: "AICTE", critical: "Critical" },
        { name: "Land Ownership", norm: "Registered Sale Deed / Gift Deed", authority: "AICTE", critical: "Mandatory" },
        { name: "Land Use Certificate (LUC)", norm: "Issued by Competent Authority", authority: "AICTE", critical: "Mandatory" },
      ],
    },

    {
      category: "Instructional Area",
      items: [
        { name: "Classrooms (UG)", norm: "1 per Division (66 sq.m each)", authority: "AICTE", critical: "Mandatory" },
        { name: "Tutorial Rooms (UG)", norm: "1 per 4 Divisions (33 sq.m each)", authority: "AICTE", critical: "Mandatory" },
        { name: "Laboratories (UG)", norm: "Min 5 Labs per Course (66 sq.m each)", authority: "AICTE", critical: "Critical" },
        { name: "Workshop/Manufacturing Lab", norm: "200 sq.m", authority: "AICTE", critical: "Mandatory" },
        { name: "Drawing Hall", norm: "132 sq.m", authority: "AICTE", critical: "Mandatory" },
        { name: "Seminar Hall", norm: "132 sq.m (Min 1)", authority: "AICTE", critical: "Desired" },
      ],
    },

    {
      category: "Admin Area",
      items: [
        { name: "Principal/Director Office", norm: "30 sq.m", authority: "AICTE", critical: "Mandatory" },
        { name: "Board Room", norm: "20 sq.m", authority: "AICTE", critical: "Mandatory" },
        { name: "Faculty Cabin", norm: "5 sq.m per faculty", authority: "AICTE", critical: "Mandatory" },
        { name: "Central Store", norm: "30 sq.m", authority: "AICTE", critical: "Mandatory" },
        { name: "Exam Control Office", norm: "30 sq.m", authority: "AICTE", critical: "Mandatory" },
        { name: "Placement Office", norm: "30 sq.m", authority: "AICTE", critical: "Mandatory" },
      ],
    },

    {
      category: "Amenities Area",
      items: [
        { name: "Toilets (Gents/Ladies)", norm: "350 sq.m total (Separate required)", authority: "AICTE", critical: "Mandatory" },
        { name: "Boys Common Room", norm: "75 sq.m", authority: "AICTE", critical: "Mandatory" },
        { name: "Girls Common Room", norm: "75 sq.m", authority: "AICTE", critical: "Mandatory" },
        { name: "Cafeteria", norm: "150 sq.m", authority: "AICTE", critical: "Mandatory" },
        { name: "First Aid / Sick Room", norm: "10 sq.m", authority: "AICTE", critical: "Mandatory" },
      ],
    },
  ];

  return (
    <Layout showNavbar={false}>
      <StepProgress currentStep={2} />

      
      <p className="text-gray-600 mb-6">
        Fill all required parameters for UGC / AICTE approval.
        <br />
        Data auto-saves section-wise.
      </p>

      {/*  AUTO GENERATED PARAMETER SECTIONS */}
      {parameterData.map((section, index) => (
        <section
          key={index}
          className="bg-white shadow rounded-xl p-6 mb-10 border border-gray-200"
        >
          <h2 className="text-xl font-semibold mb-4 text-[#5A189A]">
            {section.category}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.items.map((item, idx) => (
              <div key={idx}>
                <label className="font-semibold text-gray-800">
                  {item.name}
                </label>

                <input
                  className="w-full border p-3 rounded mt-1 focus:ring-2 focus:ring-[#5A189A]"
                  placeholder={`Norm: ${item.norm}`}
                />

                <p className="text-xs mt-1 text-gray-500">
                  Authority: <b>{item.authority}</b> | Criticality:{" "}
                  <span
                    className={
                      item.critical === "Critical"
                        ? "text-red-600"
                        : "text-blue-600"
                    }
                  >
                    {item.critical}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* ==== SAVE BUTTON ==== */}
      <button className="bg-blue-700 text-white w-full py-3 rounded-lg font-bold flex justify-center gap-2 hover:bg-blue-800">
        <Save /> Save Parameters
      </button>
    </Layout>
  );
};

export default ParametersEntry;
