// DocumentUpload.jsx - Updated with single PDF upload and government styling
import React, { useContext, useState } from "react";
import StepProgress from "../../Components/StepProgress";
import { FileText, CheckCircle, Clock, AlertCircle, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../Context/UseContext";
import { toast, ToastContainer } from "react-toastify";

const CATEGORIES = [
  { 
    key: "consolidated", 
    label: "Consolidated Institution Document", 
    description: "Upload a single PDF containing all required documents",
    required: true
  }
];

const STATUS_STYLES = {
  Verified: "bg-green-100 text-green-800 border-green-200",
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Re-upload Requested": "bg-red-100 text-red-800 border-red-200",
};

export default function DocumentUpload() {
  const [disabledOn, setDisabledOn] = useState(false)
  const { currentInstitutionId } = useContext(AppContext);

  const [document, setDocument] = useState({ 
    file: null, 
    status: "Pending", 
    uploadedAt: null 
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const handleFileUpload = (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert("File size must be less than 50MB.");
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          setDocument({
            file,
            status: "Pending",
            uploadedAt: new Date().toLocaleString()
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const previewFile = () => {
    if (!document.file) return;
    const url = URL.createObjectURL(document.file);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!document.file){
      alert("Please upload a document before submitting.");
      return;
    }

    setDisabledOn(true);
    const DocumentData = new FormData();
    DocumentData.append('file', document.file);
    DocumentData.append('institution_id', currentInstitutionId);
    DocumentData.append('title', 'Consolidated Institution Document');

    try{
      const response = await fetch(`http://localhost:3000/api/institution/documents/upload`, {
        method: 'POST',
        body: DocumentData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Document uploaded successfully!",{
          autoClose: 1000,
          onClose: () => {
            navigate('/institution/application-submission/' + currentInstitutionId);
          }
        });
      } else {
        toast.error(`Failed to upload document: ${data.message || 'Unknown error'}`);
      }
    }catch(err){
      console.error("Error uploading document:", err);
    }   
    finally{
      setDisabledOn(false);
    }
  }

  const StatusBadge = ({ status }) => (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${STATUS_STYLES[status] || STATUS_STYLES.Pending}`}
    >
      {status === "Verified" ? <CheckCircle size={14} /> : 
       status === "Pending" ? <Clock size={14} /> : 
       <AlertCircle size={14} />}
      {status}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-start gap-8">
      <StepProgress currentStep={3} />

      <div className="max-w-4xl w-full">
        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Upload</h1>
          <p className="text-gray-600">
            Upload a single consolidated PDF document containing all required institution information.
            Maximum file size: 50MB
          </p>
        </div>

        {/* UPLOAD CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold flex items-center gap-3 text-gray-900">
                <FileText className="text-blue-600" size={24} /> 
                Consolidated Institution Document
              </h3>
              <p className="text-gray-600 mt-1">
                Include all mandatory documents in a single PDF file
              </p>
            </div>
            <StatusBadge status={document.status} />
          </div>

          {/* UPLOAD AREA */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
            {!document.file ? (
              <>
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Upload your consolidated PDF document
                </p>
                <p className="text-gray-500 mb-4">
                  Drag and drop your file here or click to browse
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors"
                >
                  Choose File
                </label>
                <p className="text-sm text-gray-500 mt-3">
                  Supported format: PDF (Max 50MB)
                </p>
              </>
            ) : (
              <>
                <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Document Successfully Uploaded
                </p>
                <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 truncate">
                      {document.file.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {(document.file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-left">
                    Uploaded on: {document.uploadedAt}
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={previewFile}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Preview Document
                  </button>
                  <button
                    onClick={() => setDocument({ file: null, status: "Pending", uploadedAt: null })}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Replace File
                  </button>
                </div>
              </>
            )}
          </div>

          {/* DOCUMENT REQUIREMENTS */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-blue-900 mb-3">Required Documents Checklist</h4>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                Institution Registration Certificate
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                Land Ownership Documents
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                Infrastructure Details and Photos
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                Faculty Qualifications and Appointments
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                Financial Statements and Bank Details
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                Accreditation Certificates (if any)
              </li>
            </ul>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="mt-8 flex justify-end">
            <button
              disabled={!document.file || disabledOn}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                document.file 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={(e)=>{
                handleSubmit(e);
              }}
            >
              Save & Continue
            </button>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}