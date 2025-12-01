import React, { useContext, useState } from "react";
import StepProgress from "../../Components/StepProgress";
import { useNavigate } from "react-router-dom";
import { Send, Shield, FileCheck, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import AppContext from "../../Context/UseContext";

const ApplicationSubmission = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { currentInstitutionId } = useContext(AppContext);

  const handleSubmit = async () => {
    setShowConfirm(false);
    try{
      const response = await fetch(`http://localhost:3000/api/institution/application/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ institution_id: currentInstitutionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Submission failed:", errorData.message);
        alert(`Submission failed: ${errorData.message}`);
        navigate("/institution/application");
      }

      if (response.ok) {
        const data = await response.json();
        console.log("Application submitted successfully:", data);
        alert("Application submitted successfully!");
        navigate("/institution/application");
      }
    }catch(err){
      console.error("Error submitting application:", err);
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-start gap-8">
      <StepProgress currentStep={4} />
      
      <div className="max-w-2xl w-full flex flex-col items-center">
        {/* HEADER SECTION */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Application Submission
          </h1>
          <p className="text-gray-600 text-lg max-w-md">
            Finalize and submit your institution application for UGC/AICTE approval
          </p>
        </div>

        {/* APPLICATION STATUS CARD */}
        {!submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-md"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="text-blue-600" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to Submit
              </h2>
              <p className="text-gray-600 text-sm">
                All application sections have been completed and verified
              </p>
            </div>

            {/* KEY POINTS */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle size={16} className="text-green-500" />
                <span>Institution profile completed</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle size={16} className="text-green-500" />
                <span>Infrastructure parameters verified</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle size={16} className="text-green-500" />
                <span>All documents uploaded</span>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 shadow-sm transition-colors duration-200"
            >
              <Send size={20} />
              Submit Application
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By submitting, you confirm all information is accurate and complete
            </p>
          </motion.div>
        ) : (
          /* SUCCESS STATE */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-sm border border-green-200 p-8 w-full max-w-md text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Application Submitted
            </h2>
            
            <p className="text-gray-600 mb-4">
              Your application <strong>APP-2024-001234</strong> has been successfully submitted for review.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 justify-center text-green-700">
                <Shield size={16} />
                <span className="text-sm font-medium">Status: Under Review</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              You will receive updates via email and dashboard notifications.
            </p>
          </motion.div>
        )}

        {/* CONFIRMATION MODAL */}
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
            >
              {/* MODAL HEADER */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="text-blue-600" size={20} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Confirm Submission
                  </h2>
                </div>
                <p className="text-gray-600">
                  You are about to submit your institution application. This action cannot be undone.
                </p>
              </div>

              {/* IMPORTANT NOTICE */}
              <div className="p-4 bg-blue-50 border-b border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">!</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Important Notice</h4>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Application will be locked for editing</li>
                      <li>• Review process takes 15-30 working days</li>
                      <li>• Ensure all information is accurate</li>
                    </ul>
                  </div>
                </div>
              </div>
        
              {/* ACTION BUTTONS */}
              <div className="p-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-sm"
                >
                  Confirm Submission
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ApplicationSubmission;