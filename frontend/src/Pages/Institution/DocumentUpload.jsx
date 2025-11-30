// src/Pages/Institution/DocumentUpload.jsx
import React, { useState } from "react";
import Layout from "../../Components/Layout";
import StepProgress from "../../Components/StepProgress";
import { FileText, History, CheckCircle, Clock, AlertCircle, ImageIcon, Paperclip } from "lucide-react";


const CATEGORIES = [
  { key: "mandatory", label: "Mandatory Documents" },
  { key: "academic", label: "Academic Documents" },
  { key: "admin", label: "Administrative Records" },
  { key: "infra", label: "Infrastructure Proofs" },
  { key: "finance", label: "Financial Documents" },
  { key: "faculty", label: "Faculty CVs" },
  { key: "annual", label: "Annual Reports" },
];

const STATUS_STYLES = {
  Verified: "bg-green-100 text-green-800 border-green-200",
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Re-upload Requested": "bg-red-100 text-red-800 border-red-200",
};

export default function DocumentUpload() {
  // documents state: one entry per category with file, status, history
  const [documents, setDocuments] = useState(() =>
    CATEGORIES.reduce((acc, c) => {
      acc[c.key] = { file: null, status: "Pending", history: [] };
      return acc;
    }, {})
  );

  const [digitalSignature, setDigitalSignature] = useState(null);

  // Accept only these mime types / extensions
  const ACCEPTED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  // Handle a new uploaded file for a category
  const handleUpload = (categoryKey, file) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert("Only PDF / JPG / PNG files are allowed.");
      return;
    }

    setDocuments((prev) => {
      const prevCat = prev[categoryKey];
      const newRecord = {
        fileName: file.name,
        uploadedOn: new Date().toLocaleString(),
        status: "Pending",
      };

      return {
        ...prev,
        [categoryKey]: {
          file,
          status: "Pending",
          history: [...prevCat.history, newRecord],
        },
      };
    });
  };

  // Preview file in new tab/window
  const previewFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
    // revokeObjectURL later not necessary here (browser will cleanup),
    // or you can revoke after a short timeout if preferred:
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  // Manually change status for demo/testing (in real app status will come from backend)
  const setStatus = (categoryKey, status) => {
    setDocuments((prev) => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        status,
        history: prev[categoryKey].history.map((h, i) =>
          i === prev[categoryKey].history.length - 1 ? { ...h, status } : h
        ),
      },
    }));
  };

  // Upload digital signature
  const handleSignature = (file) => {
    if (!file) return;
    if (!["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
      alert("Signature must be an image (PNG/JPG).");
      return;
    }
    setDigitalSignature(file);
  };

  // Small helper to render status badge
  const StatusBadge = ({ status }) => (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${STATUS_STYLES[status] || STATUS_STYLES.Pending}`}
    >
      {status === "Verified" ? <CheckCircle size={14} /> : status === "Pending" ? <Clock size={14} /> : <AlertCircle size={14} />}
      {status}
    </span>
  );

  return (
    <Layout showNavbar={false}>
      <StepProgress currentStep={3} />

      <div className="max-w-6xl mx-auto p-6">
      
        <p className="text-gray-600 mb-6">
          Upload single file for each required category. Allowed: PDF / JPG / PNG.
          <br />
          Use preview to view uploads. Status and version history are shown per category.
        </p>

        {/* Upload cards */}
        <div className="grid grid-cols-1 gap-6">
          {CATEGORIES.map((cat) => {
            const data = documents[cat.key];
            return (
              <div key={cat.key} className="bg-white p-6 rounded-xl shadow border">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="text-indigo-600" /> {cat.label}
                  </h3>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={data.status} />
                    {/* Quick status toggles for demo/testing */}
                    <div className="hidden sm:flex items-center gap-2">
                      <button
                        onClick={() => setStatus(cat.key, "Verified")}
                        className="text-sm px-2 py-1 rounded border hover:bg-green-50"
                        title="Mark Verified"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => setStatus(cat.key, "Re-upload Requested")}
                        className="text-sm px-2 py-1 rounded border hover:bg-red-50"
                        title="Request Re-upload"
                      >
                        Re-upload
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  {/* file input */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select file</label>
                    <div className="flex gap-3">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleUpload(cat.key, e.target.files[0])}
                        className="block w-full text-sm text-gray-700 border rounded p-2"
                      />
                      <button
                        onClick={() => data.file && previewFile(data.file)}
                        disabled={!data.file}
                        className={`px-4 py-2 rounded text-white font-semibold ${data.file ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed"}`}
                      >
                        Preview
                      </button>
                    </div>

                    {/* small details */}
                    <div className="mt-3 text-sm text-gray-600">
                      <div>
                        {data.file ? (
                          <>
                            <span className="font-medium">{data.file.name}</span>
                            <span className="ml-3 text-xs text-gray-500">({(data.file.size / 1024).toFixed(0)} KB)</span>
                          </>
                        ) : (
                          <span>No file selected</span>
                        )}
                      </div>
                      <div className="mt-1">Allowed: PDF / JPG / PNG</div>
                    </div>
                  </div>

                  {/* version history */}
                  <div className="bg-gray-50 border rounded p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Version history</h4>
                      <History size={16} />
                    </div>

                    <ul className="mt-3 text-sm space-y-2 max-h-36 overflow-auto pr-2">
                      {data.history.length === 0 ? (
                        <li className="text-gray-500">No uploads yet</li>
                      ) : (
                        data.history.slice().reverse().map((h, idx) => (
                          <li key={idx} className="flex items-start justify-between gap-2 border-b pb-2">
                            <div>
                              <div className="font-medium">{h.fileName}</div>
                              <div className="text-xs text-gray-500">{h.uploadedOn}</div>
                            </div>
                            <div className="text-right">
                              <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 border">{h.status || "Pending"}</span>
                              <div className="mt-1">
                                <button
                                  onClick={() => {
                                    // preview historic file metadata: we do not store blobs for older versions in this simple UI
                                    alert("To preview older versions, integrate backend version storage (frontend placeholder).");
                                  }}
                                  className="text-xs text-indigo-600 underline"
                                >
                                  View
                                </button>
                              </div>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Digital signature */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow border flex flex-col md:flex-row items-start gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Paperclip className="text-purple-600" /> Digital Signature
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Upload your official signature image (PNG / JPG). This will be used while generating certificates/reports.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={(e) => handleSignature(e.target.files[0])}
                className="border rounded p-2"
              />
              {digitalSignature ? (
                <div className="flex items-center gap-3">
                  <div className="w-28 h-12 border rounded overflow-hidden bg-white">
                    <img
                      src={URL.createObjectURL(digitalSignature)}
                      alt="signature"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{digitalSignature.name}</div>
                    <div className="text-xs text-gray-500">{(digitalSignature.size / 1024).toFixed(0)} KB</div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No signature uploaded</div>
              )}
            </div>
          </div>

          <div className="w-full md:w-56 shrink-0">
            <button
              onClick={() => alert("In a real app this would upload all docs & signatures to backend.")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold"
            >
              Save All Uploads
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
