# 🚀 Quick Reference Guide

## Start Servers

### All-in-One Start
```bash
./start-python-server.sh
```

### Manual Start

**Python Server:**
```bash
cd verification
source venv/bin/activate
python server.py
```

**ngrok:**
```bash
ngrok http 5000
```

**Backend:**
```bash
cd backend
npm start
```

## Update ngrok URL

```bash
./update-ngrok-url.sh
```

## API Endpoints

### Health Check
```bash
GET /api/verification/health
```

### Verify PDF from URL
```bash
POST /api/verification/verify-url
Body: { "pdfUrl": "https://example.com/doc.pdf" }
```

### Verify Uploaded File
```bash
POST /api/verification/verify-file
Body: multipart/form-data with 'file' field
```

### Verify Document by ID
```bash
POST /api/verification/verify-document
Body: { "documentId": "64abc..." }
```

## Environment Variables

### backend/.env
```env
PYTHON_SERVER_URL=https://your-ngrok-url.ngrok-free.app
PYTHON_LOCAL_URL=http://localhost:5000
```

### verification/.env
```env
PORT=5000
```

## Common Commands

### Check if Python server is running
```bash
curl http://localhost:5000/health
```

### Get ngrok URL
```bash
curl -s http://localhost:4040/api/tunnels | grep public_url
```

### Test verification
```bash
curl -X POST http://localhost:3000/api/verification/verify-url \
  -H "Content-Type: application/json" \
  -d '{"pdfUrl":"https://example.com/doc.pdf"}'
```

## Troubleshooting

### Python server won't start
```bash
cd verification
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python server.py
```

### Port 5000 in use
```bash
lsof -i :5000
kill -9 <PID>
```

### ngrok not connecting
```bash
ngrok config check
ngrok http 5000
```

### Backend can't connect
1. Check Python server: `curl http://localhost:5000/health`
2. Check ngrok: `curl http://localhost:4040/api/tunnels`
3. Update .env: `./update-ngrok-url.sh`
4. Restart backend

## File Locations

```
├── verification/
│   ├── server.py              # Python Flask server
│   ├── ai.py                  # PDF processing logic
│   └── requirements.txt       # Python deps
├── backend/src/
│   ├── services/
│   │   └── pythonVerification.js
│   ├── controllers/
│   │   └── verification.controller.js
│   └── routes/
│       └── verification.route.js
├── start-python-server.sh     # Start script
├── update-ngrok-url.sh        # Update ngrok URL
└── INTEGRATION_GUIDE.md       # Full documentation
```

## Support

For detailed documentation, see:
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- [PYTHON_SERVER_SETUP.md](./PYTHON_SERVER_SETUP.md)
