import React, { useContext, useState, useEffect } from "react";
import StepProgress from "../../Components/StepProgress";
import { Save, AlertCircle, CheckCircle, Info, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AppContext from "../../Context/UseContext";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const ParametersEntry = () => {
  const [formData, setFormData] = useState({});
  const [parameterTemplates, setParameterTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedTemplates, setGroupedTemplates] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentInstitutionData } = useContext(AppContext);

  // Fetch parameter templates and institution's existing values
  useEffect(() => {
    const fetchParametersFromTemplates = async () => {
      try {
        setLoading(true);
        const institutionId = id || currentInstitutionData?._id;
        
        if (!institutionId) {
          toast.error("Institution ID not found");
          return;
        }

        // Fetch merged data (templates + institution values)
        const response = await axios.get(
          `http://localhost:3000/api/institution/parameter/${institutionId}`,
          { withCredentials: true }
        );

        const templates = response.data.data;
        setParameterTemplates(templates);

        // Group by category
        const grouped = templates.reduce((acc, template) => {
          const category = template.parameter_category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(template);
          return acc;
        }, {});
        
        setGroupedTemplates(grouped);

        // Pre-fill form with existing values
        const prefilledData = {};
        templates.forEach(template => {
          if (template.institution_value) {
            prefilledData[template.template_id] = template.institution_value;
          }
        });
        setFormData(prefilledData);

      } catch (error) {
        console.error("Error fetching parameter templates:", error);
        toast.error("Failed to load parameters from Super Admin");
      } finally {
        setLoading(false);
      }
    };

    fetchParametersFromTemplates();
  }, [id, currentInstitutionData]);

  console.log(id);

  const getCriticalityStyle = (critical) => {
    const criticalLower = critical?.toLowerCase();
    if (criticalLower === "high" || criticalLower === "mandatory") {
      return "bg-red-100 text-red-800 border-red-200";
    }
    if (criticalLower === "medium" || criticalLower === "critical") {
      return "bg-orange-100 text-orange-800 border-orange-200";
    }
    if (criticalLower === "low" || criticalLower === "desired") {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getCriticalityIcon = (critical) => {
    const criticalLower = critical?.toLowerCase();
    if (criticalLower === "high" || criticalLower === "mandatory") {
      return <AlertCircle size={14} className="text-red-600" />;
    }
    if (criticalLower === "medium" || criticalLower === "critical") {
      return <AlertCircle size={14} className="text-orange-600" />;
    }
    if (criticalLower === "low" || criticalLower === "desired") {
      return <Info size={14} className="text-blue-600" />;
    }
    return <CheckCircle size={14} className="text-green-600" />;
  };

  const renderInputField = (template) => {
    const value = formData[template.template_id] || "";

    return (
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => handleInputChange(template.template_id, e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder={`Enter ${template.parameter_name.toLowerCase()}`}
        />
      </div>
    );
  };

  const handleInputChange = (templateId, value) => {
    setFormData((prev) => ({
      ...prev,
      [templateId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const institutionId = id || currentInstitutionData?._id;

    if (!institutionId) {
      toast.error("Institution ID not found");
      return;
    }

    // Create parameter array with template_id and values
    const finalParameters = parameterTemplates.map(template => ({
      parameter_template_id: template.template_id,
      institution_value: formData[template.template_id] || '',
      is_compliant: false, // You can add logic to check compliance
      remarks: ''
    })).filter(param => param.institution_value !== ''); // Only save non-empty values

    if (finalParameters.length === 0) {
      toast.error("Please fill at least 1 parameter");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/institution/parameter/save`,
        {
          institution_id: institutionId,
          parameters: finalParameters,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Parameters saved successfully!", {
          autoClose: 1000,
          onClose: () => navigate(`/institution/documents/${institutionId}`),
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to save parameters");
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
            Fill all required parameters defined by Super Admin. These parameters are live and sync with regulatory requirements.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>High/Mandatory</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Medium/Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Low/Desired</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <RefreshCw className="animate-spin mx-auto mb-4 text-blue-600" size={40} />
            <p className="text-gray-600">Loading parameters from Super Admin...</p>
          </div>
        ) : Object.keys(groupedTemplates).length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <AlertCircle className="mx-auto mb-4 text-yellow-600" size={40} />
            <p className="text-gray-600">No parameters defined yet. Contact Super Admin to add parameters.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* PARAMETER SECTIONS - DYNAMICALLY RENDERED FROM TEMPLATES */}
            {Object.keys(groupedTemplates).map((category, index) => (
              <section
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {category}
                  </h2>
                  <span className="text-sm text-gray-500">
                    ({groupedTemplates[category].length} parameters)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groupedTemplates[category].map((template, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-medium text-gray-700">
                          {template.parameter_name}
                        </label>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getCriticalityStyle(
                            template.criticality
                          )}`}
                        >
                          {getCriticalityIcon(template.criticality)}
                          {template.criticality}
                        </span>
                      </div>

                      {renderInputField(template)}

                      <div className="flex justify-between text-xs text-gray-500">
                        <span>
                          Norm: <strong>{template.norm_value}</strong>
                        </span>
                        <span>
                          Authority: <strong>{template.authority}</strong>
                        </span>
                      </div>
                      {template.description && (
                        <p className="text-xs text-gray-600 italic">{template.description}</p>
                      )}
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
                    Your entries will be saved against Super Admin defined templates
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
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default ParametersEntry;
