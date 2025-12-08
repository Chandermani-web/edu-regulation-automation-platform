# Python Verification Server Setup

This guide explains how to set up and run the Python verification server with ngrok support and local fallback.

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- ngrok account (optional, for remote access)

## 🚀 Quick Start

### 1. Python Server Setup

#### Install Dependencies

```bash
cd verification

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# OR
venv\Scripts\activate     # On Windows

# Install dependencies
pip install -r requirements.txt
```

**Note:** Always activate the virtual environment before running the server or installing packages.

#### Configure Environment

Create a `.env` file in the `verification/` directory:

```bash
cp .env.example .env
```

Edit `.env` if needed:
```
PORT=5000
```

#### Run the Server Locally

```bash
# Make sure virtual environment is activated
source venv/bin/activate  # If not already activated

# Run the server
python server.py
```

The server will start on `http://localhost:5000`

**To deactivate virtual environment when done:**
```bash
deactivate
```

### 2. Ngrok Setup (Optional but Recommended)

#### Install ngrok

Download from [ngrok.com](https://ngrok.com/download) or install via:

**macOS:**
```bash
brew install ngrok
```

**Linux:**
```bash
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok
```

**Windows:**
Download from ngrok website

#### Configure ngrok

1. Sign up at [ngrok.com](https://ngrok.com)
2. Get your authtoken from the dashboard
3. Configure ngrok:

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

#### Start ngrok Tunnel

In a new terminal, run:

```bash
ngrok http 5000
```

You'll see output like:
```
Forwarding   https://abc123.ngrok-free.app -> http://localhost:5000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

### 3. Backend Configuration

#### Update Environment Variables

In `backend/.env`, add:

```env
# Primary URL (ngrok)
PYTHON_SERVER_URL=https://abc123.ngrok-free.app

# Local fallback
PYTHON_LOCAL_URL=http://localhost:5000
```

#### Install Dependencies

```bash
cd backend
npm install
```

#### Start Backend Server

```bash
npm start
```

## 📡 API Endpoints

### Python Server Endpoints

#### Health Check
```http
GET /health
```

Response:
```json
{
  "status": "healthy",
  "message": "Python verification server is running"
}
```

#### Verify PDF from URL
```http
POST /api/verify-pdf
Content-Type: application/json

{
  "pdfUrl": "https://example.com/document.pdf"
}
```

#### Verify PDF File Upload
```http
POST /api/verify-pdf-file
Content-Type: multipart/form-data

file: [PDF file]
```

### Node.js Backend Endpoints

#### Check Python Server Health
```http
GET /api/verification/health
```

#### Verify PDF from URL
```http
POST /api/verification/verify-url
Content-Type: application/json

{
  "pdfUrl": "https://cloudinary.com/your-document.pdf"
}
```

#### Verify Uploaded PDF
```http
POST /api/verification/verify-file
Content-Type: multipart/form-data

file: [PDF file]
```

#### Verify Existing Document
```http
POST /api/verification/verify-document
Content-Type: application/json

{
  "documentId": "64abc123...",
  // OR
  "cloudinaryUrl": "https://cloudinary.com/document.pdf"
}
```

## 🔄 How It Works

1. **Node.js Backend** receives a verification request
2. **Service Layer** attempts to connect to Python server:
   - First tries `PYTHON_SERVER_URL` (ngrok)
   - Falls back to `PYTHON_LOCAL_URL` if primary fails
3. **Python Server** downloads the PDF, processes it, and returns results
4. **Backend** returns the verification results to the client

## 🧪 Testing

### Test Python Server Directly

```bash
# Health check
curl http://localhost:5000/health

# Verify PDF
curl -X POST http://localhost:5000/api/verify-pdf \
  -H "Content-Type: application/json" \
  -d '{"pdfUrl": "https://example.com/document.pdf"}'
```

### Test via Node.js Backend

```bash
# Health check
curl http://localhost:3000/api/verification/health

# Verify PDF
curl -X POST http://localhost:3000/api/verification/verify-url \
  -H "Content-Type: application/json" \
  -d '{"pdfUrl": "https://cloudinary.com/document.pdf"}'
```

## 🐛 Troubleshooting

### Python Server Not Starting

1. Check Python version: `python --version` (should be 3.8+)
2. Verify virtual environment is activated: you should see `(venv)` in your terminal prompt
3. If not activated: `source venv/bin/activate` (in verification directory)
4. Verify dependencies: `pip list | grep -E "flask|pdfplumber|ultralytics"`
5. Check port availability: `lsof -i :5000`

### ngrok Connection Issues

1. Verify ngrok is running: `curl http://localhost:4040/api/tunnels`
2. Check authtoken: `ngrok config check`
3. Update backend `.env` with new ngrok URL

### Backend Can't Connect to Python Server

1. Check Python server is running: `curl http://localhost:5000/health`
2. Verify environment variables in `backend/.env`
3. Check firewall/network settings

### PDF Processing Errors

1. Ensure model files exist in `verification/model/`
2. Check PDF URL is accessible
3. Verify PDF is not corrupted or password-protected

## 🔒 Security Notes

- ngrok URLs expire when you restart ngrok (free tier)
- Consider using ngrok's paid plan for persistent URLs
- Always use HTTPS URLs for production
- Add authentication to Python endpoints for production use

## 📦 File Structure

```
verification/
├── ai.py                    # Core PDF processing logic
├── server.py               # Flask server
├── requirements.txt        # Python dependencies
├── .env                    # Environment configuration
├── venv/                   # Python virtual environment (created locally)
└── model/                  # ML models
    ├── classroom_classification.pt
    └── library_classification.pt

backend/
├── src/
│   ├── services/
│   │   └── pythonVerification.js    # Python server client
│   ├── controllers/
│   │   └── verification.controller.js
│   └── routes/
│       └── verification.route.js
└── .env                    # Backend configuration
```

## 🎯 Usage Example

```javascript
// In your Node.js code
import pythonVerificationService from './services/pythonVerification.js';

// Verify PDF from Cloudinary URL
const result = await pythonVerificationService.verifyPdfFromUrl(
  'https://res.cloudinary.com/your-cloud/document.pdf'
);

console.log(result.data); // Verification results
```

## 📝 Notes

- The fallback mechanism ensures your app works even if ngrok is down
- Python server automatically downloads PDFs from URLs
- Temporary files are cleaned up after processing
- Results include AICTE compliance scores and red flags
