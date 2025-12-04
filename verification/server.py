from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import tempfile
from ai import extract_text_data, analyze_images, calculate_and_verify, build_final_json

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Python verification server is running"
    }), 200

@app.route('/api/verify-pdf', methods=['POST'])
def verify_pdf():
    """
    Endpoint to receive PDF URL and process it
    Expected JSON body: { "pdfUrl": "https://example.com/document.pdf" }
    """
    try:
        data = request.get_json()
        
        if not data or 'pdfUrl' not in data:
            return jsonify({
                "success": False,
                "error": "PDF URL is required"
            }), 400
        
        pdf_url = data['pdfUrl']
        print(f"\n🔍 Processing PDF from URL: {pdf_url}\n")
        
        # Download PDF from URL to temporary file
        response = requests.get(pdf_url, timeout=30)
        response.raise_for_status()
        
        # Create temporary file to save PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(response.content)
            temp_pdf_path = temp_file.name
        
        try:
            # Process the PDF using existing functions
            text_data = extract_text_data(temp_pdf_path)
            visual_data = analyze_images(temp_pdf_path)
            scores, red_flags = calculate_and_verify(text_data, visual_data)
            final_json = build_final_json(text_data, visual_data, scores, red_flags)
            
            print("\n✅ PDF processing completed successfully")
            
            return jsonify({
                "success": True,
                "data": final_json
            }), 200
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_pdf_path):
                os.remove(temp_pdf_path)
    
    except requests.exceptions.RequestException as e:
        print(f"❌ Error downloading PDF: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Failed to download PDF: {str(e)}"
        }), 400
    
    except Exception as e:
        print(f"❌ Error processing PDF: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Error processing PDF: {str(e)}"
        }), 500

@app.route('/api/verify-pdf-file', methods=['POST'])
def verify_pdf_file():
    """
    Endpoint to receive PDF file directly
    Expected form data: file field containing PDF
    """
    try:
        if 'file' not in request.files:
            return jsonify({
                "success": False,
                "error": "No file provided"
            }), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({
                "success": False,
                "error": "No file selected"
            }), 400
        
        if not file.filename.endswith('.pdf'):
            return jsonify({
                "success": False,
                "error": "Only PDF files are supported"
            }), 400
        
        print(f"\n🔍 Processing uploaded PDF: {file.filename}\n")
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            file.save(temp_file.name)
            temp_pdf_path = temp_file.name
        
        try:
            # Process the PDF
            text_data = extract_text_data(temp_pdf_path)
            visual_data = analyze_images(temp_pdf_path)
            scores, red_flags = calculate_and_verify(text_data, visual_data)
            final_json = build_final_json(text_data, visual_data, scores, red_flags)
            
            print("\n✅ PDF processing completed successfully")
            
            return jsonify({
                "success": True,
                "data": final_json
            }), 200
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_pdf_path):
                os.remove(temp_pdf_path)
    
    except Exception as e:
        print(f"❌ Error processing PDF: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Error processing PDF: {str(e)}"
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3005))
    print(f"\n🚀 Starting Python Verification Server on port {port}...")
    print(f"📍 Health check: http://localhost:{port}/health")
    print(f"📍 Verify PDF: POST http://localhost:{port}/api/verify-pdf")
    print(f"📍 Verify PDF File: POST http://localhost:{port}/api/verify-pdf-file\n")
    
    app.run(host='0.0.0.0', port=port, debug=True)
