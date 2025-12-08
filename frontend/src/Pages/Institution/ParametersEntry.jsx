import React, { useContext, useState } from "react";
import StepProgress from "../../Components/StepProgress";
import { Save, AlertCircle, CheckCircle, Info } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AppContext from "../../Context/UseContext";
import { toast, ToastContainer } from "react-toastify";

const ParametersEntry = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentInstitutionData } = useContext(AppContext);

  console.log(id);

  const parameterData = [
    {
      category: "Land Requirement",
      icon: "🏢",
      items: [
        {
          name: "Total Land Area (Rural)",
          field: "land_area_rural",
          norm: "7.5 Acres",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "number",
          unit: "acres",
        },
        {
          name: "Total Land Area (Urban/Mega City)",
          field: "land_area_urban",
          norm: "2.5 Acres",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "number",
          unit: "acres",
        },
        {
          name: "Land Continuity",
          field: "land_continuity",
          norm: "Contiguous (Single Plot preferred)",
          authority: `${currentInstitutionData?.type}`,
          critical: "Critical",
          type: "select",
          options: ["Contiguous", "Fragmented", "Mixed"],
        },
        {
          name: "Land Ownership",
          field: "land_ownership",
          norm: "Registered Sale Deed / Gift Deed",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "select",
          options: ["Sale Deed", "Gift Deed", "Lease", "Government Allotted"],
        },
        {
          name: "Land Use Certificate (LUC)",
          field: "land_use_certificate",
          norm: "Issued by Competent Authority",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "select",
          options: ["Issued", "Applied", "Not Applied"],
        },
      ],
    },

    {
      category: "Instructional Area",
      icon: "📚",
      items: [
        {
          name: "Classrooms (UG)",
          field: "classrooms_ug",
          norm: "1 per Division (66 sq.m each)",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "number",
          unit: "classrooms",
        },
        {
          name: "Tutorial Rooms (UG)",
          field: "tutorial_rooms",
          norm: "1 per 4 Divisions (33 sq.m each)",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "number",
          unit: "rooms",
        },
        {
          name: "Laboratories (UG)",
          field: "laboratories_ug",
          norm: "Min 5 Labs per Course (66 sq.m each)",
          authority: `${currentInstitutionData?.type}`,
          critical: "Critical",
          type: "number",
          unit: "labs",
        },
        {
          name: "Workshop/Manufacturing Lab",
          field: "workshop_area",
          norm: "200 sq.m",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "number",
          unit: "sq.m",
        },
        {
          name: "Drawing Hall",
          field: "drawing_hall",
          norm: "132 sq.m",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "number",
          unit: "sq.m",
        },
        {
          name: "Seminar Hall",
          field: "seminar_hall",
          norm: "132 sq.m (Min 1)",
          authority: `${currentInstitutionData?.type}`,
          critical: "Desired",
          type: "number",
          unit: "sq.m",
        },
      ],
    },

    {
      category: "Admin Area",
      icon: "💼",
      items: [
        {
          name: "Principal/Director Office",
          field: "principal_office",
          norm: "30 sq.m",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "number",
          unit: "sq.m",
        },
        {
          name: "Board Room",
          field: "board_room",
          norm: "20 sq.m",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "number",
          unit: "sq.m",
        },
        {
          name: "Faculty Cabin",
          field: "faculty_cabin",
          norm: "5 sq.m per faculty",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "number",
          unit: "sq.m",
        },
        {
          name: "Central Store",
          field: "central_store",
          norm: "30 sq.m",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "number",
          unit: "sq.m",
        },
        {
          name: "Exam Control Office",
          field: "exam_office",
          norm: "30 sq.m",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "number",
          unit: "sq.m",
        },
        {
          name: "Placement Office",
          field: "placement_office",
          norm: "30 sq.m",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "number",
          unit: "sq.m",
        },
      ],
    },

    {
      category: "Amenities Area",
      icon: "🏥",
      items: [
        {
          name: "Toilets (Gents/Ladies)",
          field: "toilets_area",
          norm: "350 sq.m total (Separate required)",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "number",
          unit: "sq.m",
        },
        {
          name: "Boys Common Room",
          field: "boys_common_room",
          norm: "75 sq.m",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "number",
          unit: "sq.m",
        },
        {
          name: "Girls Common Room",
          field: "girls_common_room",
          norm: "75 sq.m",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "number",
          unit: "sq.m",
        },
        {
          name: "Cafeteria",
          field: "cafeteria_area",
          norm: "150 sq.m",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "number",
          unit: "sq.m",
        },
        {
          name: "First Aid / Sick Room",
          field: "first_aid_room",
          norm: "10 sq.m",
          authority: `${currentInstitutionData?.type}`,
          critical: "Mandatory",
          type: "number",
          unit: "sq.m",
        },
      ],
    },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getCriticalityStyle = (critical) => {
    switch (critical) {
      case "Mandatory":
        return "bg-red-100 text-red-800 border-red-200";
      case "Critical":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Desired":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCriticalityIcon = (critical) => {
    switch (critical) {
      case "Mandatory":
        return <AlertCircle size={14} className="text-red-600" />;
      case "Critical":
        return <AlertCircle size={14} className="text-orange-600" />;
      case "Desired":
        return <Info size={14} className="text-blue-600" />;
      default:
        return <CheckCircle size={14} className="text-green-600" />;
    }
  };

  const renderInputField = (item) => {
    const value = formData[item.field] || "";

    if (item.type === "select") {
      return (
        <select
          value={value}
          onChange={(e) => handleInputChange(item.field, e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          required={item.critical === "Mandatory"}
        >
          <option value="">Select option</option>
          {item.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <div className="relative">
        <input
          type={item.type || "text"}
          value={value}
          onChange={(e) => handleInputChange(item.field, e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-16"
          placeholder={`Enter ${item.name.toLowerCase()}`}
          required={item.critical === "Mandatory"}
        />
        {item.unit && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            {item.unit}
          </span>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const institutionId = id || currentInstitutionData?._id;

    if (!institutionId) {
      toast.error("Institution ID not found");
      return;
    }

    // ✅ CREATE PROPER PARAMETER OBJECTS
    const finalParameters = [];

    parameterData.forEach((section) => {
      section.items.forEach((item) => {
        if (formData[item.field] !== undefined && formData[item.field] !== "") {
          finalParameters.push({
            parameter_category: section.category,
            parameter_name: item.name,
            norm_value: item.norm,
            institution_value: formData[item.field],
            authority: item.authority,
            criticality: item.critical,
            is_compliant: true,
          });
        }
      });
    });

    if (finalParameters.length === 0) {
      toast.error("Please fill at least 1 parameter");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/institution/parameter/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            institution_id: institutionId,
            parameters: finalParameters,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Parameters saved successfully!",{
          autoClose: 1000,
          onClose: () => navigate(`/institution/documents/${institutionId}`),
        });
      } else {
        toast.error(data.message || "Failed to save parameters.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server crashed while saving data");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-start gap-8">
      <StepProgress currentStep={2} />

      <div className="max-w-6xl w-full">
        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Infrastructure Parameters
          </h1>
          <p className="text-gray-600 mb-4">
            Fill all required parameters for UGC / AICTE approval. Fields marked
            with <span className="text-red-500">*</span> are mandatory.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Mandatory</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Desired</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* PARAMETER SECTIONS */}
          {parameterData.map((section, index) => (
            <section
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="text-xl font-semibold text-gray-900">
                  {section.category}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.items.map((item, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-gray-700">
                        {item.name}
                        {item.critical === "Mandatory" && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getCriticalityStyle(
                          item.critical
                        )}`}
                      >
                        {getCriticalityIcon(item.critical)}
                        {item.critical}
                      </span>
                    </div>

                    {renderInputField(item)}

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        Norm: <strong>{item.norm}</strong>
                      </span>
                      <span>
                        Authority: <strong>{item.authority}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* SUBMIT BUTTON */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Save Parameters</h3>
                <p className="text-sm text-gray-600">
                  All changes will be auto-saved section-wise
                </p>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm"
              >
                <Save size={20} />
                Save All Parameters
              </button>
            </div>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ParametersEntry;
