import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar";

const DocumentUpload = () => {
  const [docs, setDocs] = useState({
    mandatory: null,
    academic: null,
    administrative: null,
    infrastructure: null,
    financial: null,
    faculty: null,
    annual: null,
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDocs({ ...docs, [name]: files[0] });
  };

  const handleUpload = (category) => {
    alert(`Uploaded: ${category} document`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col w-full p-6">
        <h1 className="text-2xl font-bold mb-6">Document Upload</h1>

        <p className="text-gray-600 mb-6">
          Upload all required documents. Only PDF / JPG / PNG formats allowed.
        </p>

        {/* CATEGORY BLOCK COMPONENT */}
        {[
          {
            title: "Mandatory Documents",
            key: "mandatory",
          },
          {
            title: "Academic Documents",
            key: "academic",
          },
          {
            title: "Administrative Records",
            key: "administrative",
          },
          {
            title: "Infrastructure Proofs",
            key: "infrastructure",
          },
          {
            title: "Financial Documents",
            key: "financial",
          },
          {
            title: "Faculty CVs",
            key: "faculty",
          },
          {
            title: "Annual Reports",
            key: "annual",
          },
        ].map((item) => (
          <div
            key={item.key}
            className="bg-white shadow rounded p-6 mb-6 border"
          >
            <h2 className="text-xl font-semibold mb-4">{item.title}</h2>

            <input
              type="file"
              name={item.key}
              onChange={handleFileChange}
              className="border w-full p-2 rounded"
              accept=".pdf,.jpg,.jpeg,.png"
            />

            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-600">
                {docs[item.key]
                  ? `Selected: ${docs[item.key].name}`
                  : "No file selected"}
              </p>

              <button
                onClick={() => handleUpload(item.key)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Upload
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentUpload;
