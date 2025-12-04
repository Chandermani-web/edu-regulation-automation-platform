# 🔗 Node.js ↔ Python Integration Guide

This document explains the integration between the Node.js backend and Python verification server.

## 🎯 Overview

The system allows your Node.js backend to send PDF URLs to a Python server for AICTE compliance verification. The Python server processes PDFs using AI/ML models and returns detailed verification results.

## ✨ Features

- ✅ **PDF URL Processing**: Send Cloudinary or any public PDF URL to Python server
- ✅ **File Upload Support**: Upload PDF files directly through Node.js
- ✅ **ngrok Integration**: Public access to local Python server
- ✅ **Automatic Fallback**: Falls back to local server if ngrok is unavailable
- ✅ **Health Monitoring**: Check Python server status
- ✅ **Error Handling**: Comprehensive error handling and logging

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │
│   React App     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Node.js       │
│   Backend       │
│   (Express)     │
└────────┬────────┘
         │
         │ HTTP Request
         ▼
┌─────────────────┐      ┌──────────────┐
│  Python Server  │◄─────┤    ngrok     │
│   (Flask)       │      │   (Public)   │
│                 │      └──────────────┘
│  - PDF Parser   │
│  - AI Models    │
│  - Verification │
└─────────────────┘
```

## 📋 Setup Instructions

### 1. Install Dependencies

#### Backend (Node.js)
```bash
cd backend
npm install
```

This installs:
- `axios` - HTTP client
- `form-data` - Multipart form data handling

#### Python Server
```bash
cd verification
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

This installs:
- `flask` - Web framework
- `flask-cors` - CORS support
- `pdfplumber` - PDF text extraction
- `PyMuPDF` - PDF processing
- `ultralytics` - YOLO models
- `requests` - HTTP client
- And other dependencies

### 2. Configure Environment Variables

#### Backend `.env`
```env
# Python Server URLs
PYTHON_SERVER_URL=https://your-ngrok-url.ngrok-free.app
PYTHON_LOCAL_URL=http://localhost:5000
```

#### Python Server `.env`
```env
PORT=5000
```

### 3. Start the Servers

#### Quick Start (All-in-One)
```bash
./start-python-server.sh
```

This script:
1. Starts the Python Flask server
2. Starts ngrok tunnel (if available)
3. Displays the public URL

#### Manual Start

**Python Server:**
```bash
cd verification
source venv/bin/activate
python server.py
```

**ngrok (in a new terminal):**
```bash
ngrok http 5000
```

**Node.js Backend:**
```bash
cd backend
npm start
```

## 🔌 API Usage

### From Node.js Code

```javascript
import pythonVerificationService from './services/pythonVerification.js';

// Example 1: Verify PDF from Cloudinary URL
const result = await pythonVerificationService.verifyPdfFromUrl(
  'https://res.cloudinary.com/your-cloud/document.pdf'
);

console.log(result.data);
// {
//   "institution_type": "UNIVERSITY",
//   "scores": { ... },
//   "red_flags": [ ... ],
//   ...
// }

// Example 2: Verify PDF from file buffer
const fileBuffer = req.file.buffer;
const result = await pythonVerificationService.verifyPdfFromFile(
  fileBuffer,
  'document.pdf'
);
```

### From REST API

#### 1. Check Server Health

```bash
curl http://localhost:3000/api/verification/health
```

Response:
```json
{
  "success": true,
  "message": "Python verification server is healthy",
  "serverUrl": "http://localhost:5000"
}
```

#### 2. Verify PDF from URL

```bash
curl -X POST http://localhost:3000/api/verification/verify-url \
  -H "Content-Type: application/json" \
  -d '{
    "pdfUrl": "https://res.cloudinary.com/demo/document.pdf"
  }'
```

Response:
```json
{
  "success": true,
  "message": "PDF verification completed successfully",
  "serverUsed": "http://localhost:5000",
  "data": {
    "institution_type": "UNIVERSITY",
    "institution_name": "Example University",
    "scores": {
      "overall": 85,
      "financial": 90,
      "faculty": 80,
      "infrastructure": 85,
      "visual": 85
    },
    "red_flags": [],
    "extracted_data": { ... }
  }
}
```

#### 3. Verify Uploaded PDF

```bash
curl -X POST http://localhost:3000/api/verification/verify-file \
  -F "file=@/path/to/document.pdf"
```

#### 4. Verify Existing Document

```bash
curl -X POST http://localhost:3000/api/verification/verify-document \
  -H "Content-Type: application/json" \
  -d '{
    "documentId": "64abc123def456..."
  }'
```

Or with direct URL:

```bash
curl -X POST http://localhost:3000/api/verification/verify-document \
  -H "Content-Type: application/json" \
  -d '{
    "cloudinaryUrl": "https://res.cloudinary.com/demo/document.pdf"
  }'
```

## 🔄 Fallback Mechanism

The system automatically handles server failures:

1. **Primary Attempt**: Tries `PYTHON_SERVER_URL` (ngrok)
2. **Fallback**: If primary fails, tries `PYTHON_LOCAL_URL`
3. **Error**: If both fail, returns detailed error message

```javascript
// Automatically handled in the service
const result = await pythonVerificationService.verifyPdfFromUrl(pdfUrl);
// Tries ngrok first, falls back to localhost
```

## 🧪 Testing Examples

### JavaScript/Node.js

```javascript
// In your controller or service
import pythonVerificationService from '../services/pythonVerification.js';

async function testVerification() {
  try {
    // Test health
    const isHealthy = await pythonVerificationService.checkHealth();
    console.log('Server healthy:', isHealthy);
    
    // Test PDF verification
    const result = await pythonVerificationService.verifyPdfFromUrl(
      'https://example.com/sample.pdf'
    );
    
    console.log('Verification result:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Frontend (React)

```javascript
// In your React component
const verifyDocument = async (pdfUrl) => {
  try {
    const response = await fetch('http://localhost:3000/api/verification/verify-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pdfUrl }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Verification scores:', data.data.scores);
      console.log('Red flags:', data.data.red_flags);
    }
  } catch (error) {
    console.error('Verification failed:', error);
  }
};
```

## 📊 Response Structure

### Successful Response

```json
{
  "success": true,
  "message": "PDF verification completed successfully",
  "serverUsed": "https://abc123.ngrok-free.app",
  "data": {
    "institution_type": "UNIVERSITY",
    "institution_name": "Example University",
    "head_title": "Vice Chancellor",
    "scores": {
      "overall": 85,
      "financial": 90,
      "faculty": 80,
      "infrastructure": 85,
      "visual": 85
    },
    "red_flags": [
      {
        "category": "faculty",
        "message": "Faculty ratio slightly below requirement",
        "severity": "medium"
      }
    ],
    "extracted_data": {
      "corpus_fund": 150000000,
      "faculty_count": 200,
      "student_count": 3000,
      "admin_area": 1200
    },
    "visual_analysis": {
      "total_images": 15,
      "classroom_count": 8,
      "library_count": 3,
      "laboratory_count": 4
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Failed to connect to Python verification server",
  "error": "Connection timeout. Make sure the Python server is running."
}
```

## 🛠️ Troubleshooting

### Backend Can't Connect

```bash
# Check Python server
curl http://localhost:5000/health

# If it fails, restart Python server
cd verification
python server.py

# Check ngrok
curl http://localhost:4040/api/tunnels
```

### ngrok URL Changed

When ngrok restarts, you get a new URL. Update your backend `.env`:

```bash
# Get new URL from ngrok console, then update
echo "PYTHON_SERVER_URL=https://new-url.ngrok-free.app" >> backend/.env
```

### Python Dependencies Missing

```bash
cd verification
pip install -r requirements.txt
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

## 🔒 Security Considerations

1. **Authentication**: Add API keys for production
2. **HTTPS Only**: Use HTTPS URLs in production
3. **Rate Limiting**: Implement rate limiting on endpoints
4. **Input Validation**: Validate PDF URLs and files
5. **Timeout**: Set appropriate timeouts for large PDFs

## 📝 File Overview

```
backend/src/
├── services/
│   └── pythonVerification.js       # Python server client service
├── controllers/
│   └── verification.controller.js   # Request handlers
└── routes/
    └── verification.route.js        # API route definitions

verification/
├── ai.py                            # Core PDF processing
├── server.py                        # Flask API server
├── requirements.txt                 # Python dependencies
└── model/                           # ML models
    ├── classroom_classification.pt
    └── library_classification.pt
```

## 🚀 Production Deployment

### Python Server (Recommended: Railway, Render, or AWS)

```bash
# On your server
cd verification
pip install -r requirements.txt
gunicorn -w 4 -b 0.0.0.0:5000 server:app
```

### Backend Configuration

```env
# Use production Python server URL
PYTHON_SERVER_URL=https://your-python-server.com
PYTHON_LOCAL_URL=http://localhost:5000  # Keep as fallback
```

## 💡 Tips

1. **Keep ngrok running**: Use `screen` or `tmux` to keep ngrok persistent
2. **Monitor logs**: Check both Node.js and Python logs for issues
3. **Test locally first**: Always test with local server before using ngrok
4. **Update URLs**: Remember to update backend .env when ngrok URL changes
5. **Use webhooks**: Consider ngrok webhooks for automatic URL updates

## 📚 Additional Resources

- [ngrok Documentation](https://ngrok.com/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Axios Documentation](https://axios-http.com/)
