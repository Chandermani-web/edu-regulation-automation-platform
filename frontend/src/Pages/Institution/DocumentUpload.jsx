// DocumentUpload.jsx - Updated with single PDF upload and government styling
import React, { useContext, useState, useEffect } from "react";
import StepProgress from "../../Components/StepProgress";
import { FileText, CheckCircle, Clock, AlertCircle, Upload, FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../Context/UseContext";
import { toast, ToastContainer } from "react-toastify";
import { jsPDF } from "jspdf";
import { PDFDocument } from 'pdf-lib';

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
  const { currentInstitutionId, institutionDetails, setCurrentInstitutionId, getApiUrl } = useContext(AppContext);

  const [document, setDocument] = useState({ 
    file: null, 
    status: "Pending", 
    uploadedAt: null 
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [uploadedPDF, setUploadedPDF] = useState(null); // Store the manually uploaded PDF
  const [isCombining, setIsCombining] = useState(false);
  const navigate = useNavigate();

  // Ensure institution ID is set from institutionDetails if available
  useEffect(() => {
    console.log('DocumentUpload - currentInstitutionId:', currentInstitutionId);
    console.log('DocumentUpload - institutionDetails:', institutionDetails);
    
    if (!currentInstitutionId && institutionDetails?._id) {
      console.log('Setting currentInstitutionId from institutionDetails:', institutionDetails._id);
      setCurrentInstitutionId(institutionDetails._id);
      localStorage.setItem("currentInstitutionId", institutionDetails._id);
    }
  }, [currentInstitutionId, institutionDetails, setCurrentInstitutionId]);

  // Helper function to draw a table manually
  const drawTable = (doc, data, startY, config = {}) => {
    const {
      headers = [],
      columnWidths = [],
      headerBg = [59, 130, 246],
      rowHeight = 8,
      fontSize = 9,
      margin = { left: 14, right: 14 }
    } = config;

    let y = startY;
    const pageHeight = doc.internal.pageSize.getHeight();
    const totalWidth = columnWidths.reduce((a, b) => a + b, 0);
    let x = margin.left;

    // Draw headers if provided
    if (headers.length > 0) {
      doc.setFillColor(...headerBg);
      doc.rect(x, y, totalWidth, rowHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(fontSize);
      doc.setFont(undefined, 'bold');

      headers.forEach((header, i) => {
        doc.text(header, x + 2, y + 5);
        x += columnWidths[i];
      });
      y += rowHeight;
    }

    // Draw data rows
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    data.forEach((row, rowIndex) => {
      // Check if we need a new page
      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
        
        // Redraw headers on new page
        if (headers.length > 0) {
          x = margin.left;
          doc.setFillColor(...headerBg);
          doc.rect(x, y, totalWidth, rowHeight, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont(undefined, 'bold');
          headers.forEach((header, i) => {
            doc.text(header, x + 2, y + 5);
            x += columnWidths[i];
          });
          y += rowHeight;
          doc.setTextColor(0, 0, 0);
          doc.setFont(undefined, 'normal');
        }
      }

      x = margin.left;
      
      // Alternate row colors
      if (rowIndex % 2 === 0) {
        doc.setFillColor(248, 248, 248);
        doc.rect(x, y, totalWidth, rowHeight, 'F');
      }

      // Draw cell borders and text
      row.forEach((cell, i) => {
        const cellText = String(cell || '').substring(0, 50); // Limit text length
        doc.setDrawColor(200, 200, 200);
        doc.rect(x, y, columnWidths[i], rowHeight);
        doc.text(cellText, x + 2, y + 5);
        x += columnWidths[i];
      });
      
      y += rowHeight;
    });

    return y; // Return final Y position
  };

  // Function to fetch all parameters for the institution
  const fetchInstitutionParameters = async (institutionId) => {
    try {
      const response = await fetch(
        `${getApiUrl()}/api/institution/parameter/${institutionId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch parameters');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching parameters:", error);
      toast.error("Failed to fetch institution parameters");
      return [];
    }
  };

  // Function to generate PDF with parameters and institution details
  const generateParametersPDF = async (institutionId) => {
    try {
      setIsGeneratingPDF(true);
      toast.info("Fetching institution parameters...");

      const parameters = await fetchInstitutionParameters(institutionId);

      if (!parameters || parameters.length === 0) {
        toast.error("No parameters found for this institution");
        setIsGeneratingPDF(false);
        return null;
      }

      toast.info("Generating PDF document...");

      // Create new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Add header with institution logo placeholder
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('Institution Parameters Report', pageWidth / 2, 15, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text(`${institutionDetails?.name || 'Institution'}`, pageWidth / 2, 25, { align: 'center' });
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 32, { align: 'center' });
      
      doc.setTextColor(0, 0, 0);
      
      // Add institution details section
      let yPosition = 50;
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('Institution Information', 14, yPosition);
      
      yPosition += 10;
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      
      const institutionInfo = [
        ['Name', institutionDetails?.name || 'N/A'],
        ['Type', institutionDetails?.type || 'N/A'],
        ['State', institutionDetails?.state || 'N/A'],
        ['District', institutionDetails?.district || 'N/A'],
        ['Address', institutionDetails?.full_address || 'N/A'],
        ['Established', institutionDetails?.established_year || 'N/A'],
        ['Website', institutionDetails?.website || 'N/A'],
        ['Institution Code', institutionDetails?.institution_code || 'N/A'],
        ['NAAC Grade', institutionDetails?.NAAC_grade || 'N/A'],
        ['NIRF Rank', institutionDetails?.NIRF_rank || 'N/A'],
        ['AISHE Code', institutionDetails?.AISHE_code || 'N/A'],
        ['UDISE Code', institutionDetails?.UDISE_code || 'N/A']
      ];

      yPosition = drawTable(doc, institutionInfo, yPosition, {
        columnWidths: [60, 120],
        fontSize: 10,
        rowHeight: 8
      });

      yPosition += 15;
      
      // Group parameters by category
      const groupedParams = parameters.reduce((acc, param) => {
        const category = param.parameter_category || 'Other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(param);
        return acc;
      }, {});

      // Add parameters by category
      Object.keys(groupedParams).forEach((category) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }

        // Category header
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setFillColor(59, 130, 246);
        doc.rect(14, yPosition - 5, pageWidth - 28, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text(category, 16, yPosition + 2);
        doc.setTextColor(0, 0, 0);
        yPosition += 15;

        // Parameters table for this category
        const tableData = groupedParams[category].map(param => [
          param.parameter_name || 'N/A',
          param.parameter_type || 'N/A',
          param.institution_value || param.expected_value || 'Not Set',
          param.is_compliant ? '✓ Met' : '✗ Not Met'
        ]);

        yPosition = drawTable(doc, tableData, yPosition, {
          headers: ['Parameter', 'Type', 'Value', 'Status'],
          columnWidths: [60, 30, 60, 25],
          fontSize: 9,
          rowHeight: 8
        });

        yPosition += 10;
      });

      // Summary page
      doc.addPage();
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('Parameters Summary', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      const totalParams = parameters.length;
      const compliantParams = parameters.filter(p => p.is_compliant).length;
      const complianceRate = totalParams > 0 ? ((compliantParams / totalParams) * 100).toFixed(1) : 0;

      doc.text(`Total Parameters: ${totalParams}`, 14, 40);
      doc.text(`Requirements Met: ${compliantParams}`, 14, 50);
      doc.text(`Requirements Not Met: ${totalParams - compliantParams}`, 14, 60);
      doc.text(`Overall Compliance Rate: ${complianceRate}%`, 14, 70);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Note: 'Met' indicates the institution meets the regulatory requirement for that parameter.`, 14, 85);

      toast.success("PDF generated successfully!");
      
      // Convert PDF to Blob
      const pdfBlob = doc.output('blob');
      setIsGeneratingPDF(false);
      
      return pdfBlob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
      setIsGeneratingPDF(false);
      return null;
    }
  };

  // Function to upload PDF to Cloudinary
  const uploadToCloudinary = async (file, fileName) => {
    try {
      const formData = new FormData();
      formData.append('file', file, fileName);
      formData.append('upload_preset', 'ml_default'); // Create an unsigned upload preset in Cloudinary dashboard
      
      // Configure your Cloudinary cloud name
      // You can get this from: https://console.cloudinary.com/console
      // Or set VITE_CLOUDINARY_CLOUD_NAME in your .env file
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME';
      
      if (cloudName === 'YOUR_CLOUD_NAME') {
        console.warn('Cloudinary cloud name not configured. Skipping Cloudinary upload.');
        return null;
      }
      
      toast.info("Uploading to Cloudinary...");
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const data = await response.json();
      toast.success("File uploaded to Cloudinary!");
      
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      toast.error("Failed to upload to Cloudinary. Using direct upload instead.");
      return null;
    }
  };

  // Function to combine two PDFs
  const combinePDFs = async (uploadedPdfFile, parametersPdfBlob) => {
    try {
      setIsCombining(true);
      toast.info("Combining PDFs...");

      // Read uploaded PDF
      const uploadedPdfBytes = await uploadedPdfFile.arrayBuffer();
      const uploadedPdfDoc = await PDFDocument.load(uploadedPdfBytes);

      // Read parameters PDF
      const parametersPdfBytes = await parametersPdfBlob.arrayBuffer();
      const parametersPdfDoc = await PDFDocument.load(parametersPdfBytes);

      // Create a new PDF document
      const combinedPdf = await PDFDocument.create();

      // Copy pages from parameters PDF FIRST (on top)
      const parametersPages = await combinedPdf.copyPages(parametersPdfDoc, parametersPdfDoc.getPageIndices());
      parametersPages.forEach(page => combinedPdf.addPage(page));

      // Copy pages from uploaded PDF SECOND (after parameters)
      const uploadedPages = await combinedPdf.copyPages(uploadedPdfDoc, uploadedPdfDoc.getPageIndices());
      uploadedPages.forEach(page => combinedPdf.addPage(page));

      // Save the combined PDF
      const combinedPdfBytes = await combinedPdf.save();
      const combinedPdfBlob = new Blob([combinedPdfBytes], { type: 'application/pdf' });

      setIsCombining(false);
      toast.success("PDFs combined successfully!");
      
      return combinedPdfBlob;
    } catch (error) {
      console.error("Error combining PDFs:", error);
      toast.error("Failed to combine PDFs");
      setIsCombining(false);
      return null;
    }
  };

  // Function to generate and combine with uploaded PDF
  const handleGenerateAndCombinePDFs = async () => {
    if (!uploadedPDF) {
      toast.error("Please upload a PDF document first!");
      return;
    }

    const institutionId = currentInstitutionId || institutionDetails?._id;
    
    if (!institutionId) {
      toast.error("Institution ID not found. Please refresh the page.");
      return;
    }

    // Generate parameters PDF
    const parametersPdfBlob = await generateParametersPDF(institutionId);
    
    if (!parametersPdfBlob) {
      return;
    }

    // Combine both PDFs
    const combinedPdfBlob = await combinePDFs(uploadedPDF, parametersPdfBlob);

    if (!combinedPdfBlob) {
      return;
    }

    // Create a File object from the combined Blob
    const fileName = `${institutionDetails?.name || 'Institution'}_Complete_Document_${Date.now()}.pdf`;
    const combinedPdfFile = new File([combinedPdfBlob], fileName, { type: 'application/pdf' });

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(combinedPdfFile, fileName);

    if (cloudinaryUrl) {
      setDocument({
        file: combinedPdfFile,
        status: "Pending",
        uploadedAt: new Date().toLocaleString(),
        cloudinaryUrl: cloudinaryUrl
      });
      
      setUploadProgress(100);
      toast.success("Combined PDF ready for submission!");
    } else {
      // Fallback to direct file upload
      setDocument({
        file: combinedPdfFile,
        status: "Pending",
        uploadedAt: new Date().toLocaleString()
      });
      
      setUploadProgress(100);
      toast.info("Combined PDF ready for direct upload!");
    }
  };

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

    // Store the uploaded PDF
    setUploadedPDF(file);

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // Show success message after upload completes (outside setState)
    setTimeout(() => {
      toast.success("PDF uploaded! Now click 'Generate & Combine with Parameters' to proceed.");
    }, 1100);
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

    // Get institution ID from context or institutionDetails
    const institutionId = currentInstitutionId || institutionDetails?._id;
    
    console.log('Submitting with institutionId:', institutionId);
    console.log('currentInstitutionId:', currentInstitutionId);
    console.log('institutionDetails?._id:', institutionDetails?._id);
    
    if (!institutionId) {
      toast.error("Institution ID not found. Please try refreshing the page.");
      console.error("Institution ID missing - currentInstitutionId:", currentInstitutionId, "institutionDetails:", institutionDetails);
      return;
    }

    setDisabledOn(true);
    const DocumentData = new FormData();
    DocumentData.append('file', document.file);
    DocumentData.append('institution_id', institutionId);
    DocumentData.append('title', 'Consolidated Institution Document');

    try{
      const response = await fetch(`${getApiUrl()}/api/institution/documents/upload`, {
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
            {!uploadedPDF ? (
              <>
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Step 1: Upload your institutional PDF document
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
            ) : !document.file ? (
              <>
                <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Document Uploaded Successfully
                </p>
                <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 truncate">
                      {uploadedPDF.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {(uploadedPDF.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Step 2: Generate and Combine Button */}
                <div className="mb-4">
                  <p className="text-gray-700 mb-3">
                    Step 2: Generate parameters PDF and combine with your uploaded document
                  </p>
                  <button
                    type="button"
                    onClick={handleGenerateAndCombinePDFs}
                    disabled={isGeneratingPDF || isCombining}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {(isGeneratingPDF || isCombining) ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        {isGeneratingPDF ? 'Generating...' : 'Combining...'}
                      </>
                    ) : (
                      <>
                        <FileDown size={20} />
                        Generate & Combine with Parameters
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setUploadedPDF(null);
                    setUploadProgress(0);
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                >
                  Upload a different file
                </button>
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