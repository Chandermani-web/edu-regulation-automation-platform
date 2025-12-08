import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from './cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate a professional PDF report from AI Analysis data
 * @param {Object} analysisData - The AI analysis data
 * @param {Object} applicationData - The application data
 * @param {Object} institutionData - The institution data
 * @returns {Promise<Object>} - Cloudinary upload result
 */
export async function generateAIAnalysisReport(analysisData, applicationData, institutionData) {
    return new Promise(async (resolve, reject) => {
        try {
            // Create temporary directory if it doesn't exist
            const tempDir = path.join(__dirname, '../../temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            const fileName = `AI_Report_${applicationData._id}_${Date.now()}.pdf`;
            const filePath = path.join(tempDir, fileName);

            // Create PDF document
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 50, bottom: 50, left: 50, right: 50 }
            });

            const writeStream = fs.createWriteStream(filePath);
            doc.pipe(writeStream);

            // Header
            doc.fontSize(24)
                .fillColor('#1e40af')
                .text('AI Verification Report', { align: 'center' })
                .moveDown();

            doc.fontSize(10)
                .fillColor('#6b7280')
                .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' })
                .moveDown(2);

            // Institution Details Section
            doc.fontSize(16)
                .fillColor('#1f2937')
                .text('Institution Details', { underline: true })
                .moveDown(0.5);

            doc.fontSize(11)
                .fillColor('#374151')
                .text(`Name: ${institutionData.name || 'N/A'}`)
                .text(`Type: ${institutionData.type?.toUpperCase() || 'N/A'}`)
                .text(`State: ${institutionData.state || 'N/A'}`)
                .text(`Email: ${institutionData.email || 'N/A'}`)
                .text(`Application ID: ${applicationData._id}`)
                .moveDown(1.5);

            // Add horizontal line
            doc.strokeColor('#e5e7eb')
                .lineWidth(1)
                .moveTo(50, doc.y)
                .lineTo(545, doc.y)
                .stroke()
                .moveDown(1);

            // Overall Score Section
            doc.fontSize(16)
                .fillColor('#1f2937')
                .text('Overall Assessment', { underline: true })
                .moveDown(0.5);

            const totalScore = analysisData.ai_output.verification_data.data.scores?.total_score || 0;
            const finalStatus = analysisData.ai_output.verification_data.data.final_decision?.status || 'Pending';
            console.log("getReportAIGenerator",JSON.stringify(analysisData, null, 2));
            doc.fontSize(11)
                .fillColor('#374151')
                .text(`Total Score: ${totalScore}%`)
                .text(`Status: ${finalStatus}`)
                .moveDown(1.5);

            // Verification Results Section
            if (analysisData.ai_output.verification_data?.data) {
                const vData = analysisData.ai_output.verification_data.data;
                
                doc.fontSize(16)
                    .fillColor('#1f2937')
                    .text('Document Verification Results', { underline: true })
                    .moveDown(0.5);

                // Document URL
                if (analysisData.ai_output.document_url) {
                    doc.fontSize(10)
                        .fillColor('#6b7280')
                        .text(`Document URL: ${analysisData.ai_output.document_url.substring(0, 80)}...`, { continued: false })
                        .moveDown(0.5);
                }

                // Institution details from verification
                if (vData.institution_details) {
                    doc.fontSize(12)
                        .fillColor('#4b5563')
                        .text('Institution Information:', { continued: false })
                        .fontSize(10)
                        .fillColor('#374151');
                    
                    if (vData.institution_details.name) {
                        doc.text(`  Name: ${vData.institution_details.name}`);
                    }
                    if (vData.institution_details.category) {
                        doc.text(`  Category: ${vData.institution_details.category}`);
                    }
                    if (vData.institution_details.head_title && vData.institution_details.head_name) {
                        doc.text(`  Head: ${vData.institution_details.head_title} ${vData.institution_details.head_name}`);
                    }
                    if (vData.institution_details.corpus_fund !== undefined) {
                        doc.text(`  Corpus Fund: ₹${vData.institution_details.corpus_fund}`);
                    }
                    if (vData.institution_details.students !== undefined) {
                        doc.text(`  Students: ${vData.institution_details.students}`);
                    }
                    if (vData.institution_details.faculty !== undefined) {
                        doc.text(`  Faculty: ${vData.institution_details.faculty}`);
                    }
                    if (vData.institution_details.faculty_ratio) {
                        doc.text(`  Faculty Ratio: ${vData.institution_details.faculty_ratio}`);
                    }
                    if (vData.institution_details.admin_area !== undefined) {
                        doc.text(`  Admin Area: ${vData.institution_details.admin_area} sq ft`);
                    }
                    if (vData.institution_details.computers !== undefined) {
                        doc.text(`  Computers: ${vData.institution_details.computers}`);
                    }
                    doc.moveDown(0.5);
                }

                // Visual Detection Results
                if (vData.visual_detection) {
                    doc.fontSize(12)
                        .fillColor('#4b5563')
                        .text('Visual Detection Results:', { continued: false })
                        .fontSize(10)
                        .fillColor('#374151');
                    
                    Object.entries(vData.visual_detection).forEach(([key, value]) => {
                        const displayKey = key.replace(/_/g, ' ');
                        doc.text(`  ${displayKey}: ${value}`);
                    });
                    doc.moveDown(0.5);
                }

                // Scores
                if (vData.scores) {
                    doc.fontSize(12)
                        .fillColor('#4b5563')
                        .text('Detailed Scores:', { continued: false })
                        .fontSize(10)
                        .fillColor('#374151');
                    
                    Object.entries(vData.scores).forEach(([key, value]) => {
                        const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        doc.text(`  ${displayKey}: ${value}`);
                    });
                    doc.moveDown(0.5);
                }

                // Final Decision Reasons
                if (vData.final_decision?.reasons && vData.final_decision.reasons.length > 0) {
                    doc.fontSize(12)
                        .fillColor('#dc2626')
                        .text('⚠ Issues Found:', { continued: false })
                        .fontSize(10)
                        .fillColor('#991b1b');
                    
                    vData.final_decision.reasons.forEach((reason, index) => {
                        doc.text(`  ${index + 1}. ${reason}`);
                    });
                    doc.fillColor('#374151');
                }

                doc.moveDown(1);
            }

            // Add horizontal line
            if (doc.y > 650) {
                doc.addPage();
            }
            doc.strokeColor('#e5e7eb')
                .lineWidth(1)
                .moveTo(50, doc.y)
                .lineTo(545, doc.y)
                .stroke()
                .moveDown(1);

            // Visual Detection Summary (if not shown above)
            if (analysisData.visual_detection && !analysisData.ai_output.verification_data?.data?.visual_detection) {
                doc.fontSize(16)
                    .fillColor('#1f2937')
                    .text('Visual Detection Results', { underline: true })
                    .moveDown(0.5);

                doc.fontSize(10)
                    .fillColor('#374151');

                Object.entries(analysisData.visual_detection).forEach(([key, value]) => {
                    const displayKey = key.replace(/_/g, ' ');
                    doc.text(`${displayKey}: ${value}`, { continued: false });
                });

                doc.moveDown(1);
            }

            // Final Decision Summary
            if (analysisData.final_decision?.reasons && analysisData.final_decision.reasons.length > 0) {
                if (doc.y > 650) {
                    doc.addPage();
                }

                doc.fontSize(16)
                    .fillColor('#dc2626')
                    .text('⚠ Issues & Recommendations', { underline: true })
                    .moveDown(0.5);

                doc.fontSize(10)
                    .fillColor('#991b1b');

                analysisData.final_decision.reasons.forEach((reason, index) => {
                    doc.text(`${index + 1}. ${reason}`, { continued: false });
                });

                doc.moveDown(1);
            }

            // Footer
            doc.fontSize(8)
                .fillColor('#9ca3af')
                .text(
                    'This report is generated by AI and should be reviewed by authorized personnel.',
                    50,
                    doc.page.height - 50,
                    { align: 'center' }
                );

            // Finalize the PDF
            doc.end();

            // Wait for the PDF to be written
            writeStream.on('finish', async () => {
                try {
                    // Upload to Cloudinary
                    const uploadResult = await cloudinary.uploader.upload(filePath, {
                        folder: 'ai_reports',
                        resource_type: 'raw',
                        public_id: `report_${applicationData._id}_${Date.now()}`,
                    });

                    // Get file size
                    const stats = fs.statSync(filePath);
                    const fileSize = stats.size;

                    // Clean up temp file
                    fs.unlinkSync(filePath);

                    resolve({
                        url: uploadResult.secure_url,
                        public_id: uploadResult.public_id,
                        file_size: fileSize,
                        format: uploadResult.format
                    });
                } catch (uploadError) {
                    // Clean up temp file even if upload fails
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                    reject(uploadError);
                }
            });

            writeStream.on('error', (error) => {
                // Clean up temp file on error
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
}

export default { generateAIAnalysisReport };