# 🚀 Simple Setup Guide

## Prerequisites
- Python 3.8+
- Node.js 18+
- ngrok (optional)

## Setup Steps

### 1. Install Python Dependencies

**macOS/Linux:**
```bash
cd verification
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Windows:**
```cmd
cd verification
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install --legacy-peer-deps
```

### 3. Configure Environment

Create `backend/.env`:
```env
# Database
MONGODB_URI=your_mongodb_uri

# Python Server
PYTHON_SERVER_URL=https://your-ngrok-url.ngrok-free.app
PYTHON_LOCAL_URL=http://localhost:5000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
JWT_SECRET=your_jwt_secret
```

Create `verification/.env`:
```env
PORT=5000
```

## Running the Servers

### Terminal 1: Python Server

**macOS/Linux:**
```bash
cd verification
source venv/bin/activate
python server.py
```

**Windows:**
```cmd
cd verification
venv\Scripts\activate
python server.py
```

### Terminal 2: ngrok (Optional)

```bash
ngrok http 5000
```

Then copy the HTTPS URL and update `PYTHON_SERVER_URL` in `backend/.env`

### Terminal 3: Backend

```bash
cd backend
npm start
```

### Terminal 4: Frontend

```bash
cd frontend
npm run dev
```

## Testing

```bash
# Test Python server
curl http://localhost:5000/health

# Test Backend
curl http://localhost:3000/api/verification/health

# Test PDF verification
curl -X POST http://localhost:3000/api/verification/verify-url \
  -H "Content-Type: application/json" \
  -d '{"pdfUrl":"https://example.com/document.pdf"}'
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/verification/health` | GET | Check Python server status |
| `/api/verification/verify-url` | POST | Verify PDF from URL |
| `/api/verification/verify-file` | POST | Verify uploaded PDF |
| `/api/verification/verify-document` | POST | Verify by document ID |

## Troubleshooting

### Port Already in Use

**macOS/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

**Windows:**
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Python Virtual Environment Issues

Always activate the virtual environment before running the server:
- macOS/Linux: `source venv/bin/activate`
- Windows: `venv\Scripts\activate`

### Backend Can't Connect

1. Make sure Python server is running: `curl http://localhost:5000/health`
2. Check `backend/.env` has correct `PYTHON_SERVER_URL`
3. Restart backend server

## Documentation

- [README.md](./README.md) - Project overview
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Detailed integration docs
- [CROSS_PLATFORM_SETUP.md](./CROSS_PLATFORM_SETUP.md) - Platform-specific guide
