import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar";
import { Upload, FileText, CheckCircle, Clock, AlertCircle, History, Signature } from "lucide-react";

const DocumentUpload = () => {

  // ------------ Document Upload State ------------
  const [documents, setDocuments] = useState({
    mandatory: { file: null, status: "Pending", history: [] },
    academic: { file: null, status: "Pending", history: [] },
    admin: { file: null, status: "Pending", history: [] },
    infra: { file: null, status: "Pending", history: [] },
    finance: { file: null, status: "Pending", history: [] },
    faculty: { file: null, status: "Pending", history: [] },
    annual: { file: null, status: "Pending", history: [] }
  });

  const [digitalSignature, setDigitalSignature] = useState(null);

  // ------------ Handle File Upload ------------
  const handleUpload = (category, file) => {
    const newRecord = {
      fileName: file.name,
      uploadedOn: new Date().toLocaleString(),
      status: "Pending"
    };

    setDocuments((prev) => ({
      ...prev,
      [category]: {
        file: file,
        status: "Pending",
        history: [...prev[category].history, newRecord]
      }
    }));
  };

  // ------------ Render Status Badge ------------
  const StatusBadge = ({ status }) => {
    const styles = {
      Verified: "bg-green-100 text-green-700 border-green-400",
      Pending: "bg-yellow-100 text-yellow-700 border-yellow-400",
      "Re-upload Requested": "bg-red-100 text-red-700 border-red-400",
    };

    const icons = {
      Verified: <CheckCircle size={16} />,
      Pending: <Clock size={16} />,
      "Re-upload Requested": <AlertCircle size={16} />,
    };

    return (
      <span className={`border px-2 py-1 text-sm rounded flex items-center gap-1 ${styles[status]}`}>
        {icons[status]} {status}
      </span>
    );
  };

  // ------------ Upload Card Component ------------
  const UploadCard = ({ title, category }) => {
    const data = documents[category];

    return (
      <div className="bg-white shadow-md rounded-xl p-6 mb-6 border">
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
          <FileText className="text-blue-700" /> {title}
        </h3>

        {/* File Input */}
        <input
          type="file"
          accept=".pdf,.jpg,.png"
          className="border p-2 rounded w-full"
          onChange={(e) => handleUpload(category, e.target.files[0])}
        />

        {/* Current Status */}
        <div className="mt-3">
          <b>Status:</b> <StatusBadge status={data.status} />
        </div>

        {/* File Preview */}
        {data.file && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
            <p className="font-medium">📄 {data.file.name}</p>
            <p className="text-gray-600 text-sm">{(data.file.size / 1024).toFixed(2)} KB</p>

            <button className="mt-3 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              Preview
            </button>
          </div>
        )}

        {/* Version History */}
        <div className="mt-5">
          <h4 className="font-semibold flex items-center gap-2">
            <History size={18} /> Version History
          </h4>

          <ul className="mt-2 text-sm text-gray-700">
            {data.history.length === 0 && <li>No uploads yet</li>}

            {data.history.map((item, index) => (
              <li key={index} className="border-b py-2">
                <b>{item.fileName}</b> — {item.uploadedOn}  
                <br />
                <StatusBadge status={item.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="w-full p-10">
        <h1 className="text-3xl font-bold mb-6">Document Upload</h1>
        <p className="text-gray-600 mb-8">
          Upload all required documents. Only PDF / JPG / PNG formats allowed.
        </p>

        {/* All Document Upload Cards */}
        <UploadCard title="Mandatory Documents" category="mandatory" />
        <UploadCard title="Academic Documents" category="academic" />
        <UploadCard title="Administrative Records" category="admin" />
        <UploadCard title="Infrastructure Proofs" category="infra" />
        <UploadCard title="Financial Documents" category="finance" />
        <UploadCard title="Faculty CVs" category="faculty" />
        <UploadCard title="Annual Reports" category="annual" />

        {/* Digital Signature Section */}
        <div className="bg-white shadow-md rounded-xl p-6 border mt-10">
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
            <Signature className="text-purple-700" /> Digital Signature
          </h3>

          <input
            type="file"
            accept=".png,.jpg"
            className="border p-2 rounded w-full"
            onChange={(e) => setDigitalSignature(e.target.files[0])}
          />

          {digitalSignature && (
            <p className="mt-3 text-green-700 font-medium">
              ✔ Signature uploaded: {digitalSignature.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
