# 🖥️ Cross-Platform Setup Guide

This guide covers setup instructions for both macOS/Linux and Windows.

## 📋 Prerequisites

- Python 3.8+ 
- Node.js 18+ (20.19+ recommended)
- ngrok (optional, for remote access)

## 🚀 Setup Instructions

### 1. Clone Repository

**All Platforms:**
```bash
git clone https://github.com/Chandermani-web/edu-regulation-automation-platform.git
cd edu-regulation-automation-platform
```

### 2. Python Virtual Environment Setup

#### macOS/Linux

```bash
cd verification
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Windows

```cmd
cd verification
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Node.js Backend Setup

**All Platforms:**
```bash
cd backend
npm install --legacy-peer-deps
```

### 4. Frontend Setup

**All Platforms:**
```bash
cd frontend
npm install
```

## 🎯 Starting the Servers

### Python Server

#### macOS/Linux

**Quick Start (with ngrok):**
```bash
./start-python-server.sh
```

**Manual Start:**
```bash
cd verification
source venv/bin/activate
python server.py
```

#### Windows

**Quick Start (with ngrok):**
```cmd
start-python-server.bat
```

**Manual Start:**
```cmd
cd verification
venv\Scripts\activate
python server.py
```

### ngrok (Optional)

**All Platforms:**
```bash
ngrok http 5000
```

### Update ngrok URL

#### macOS/Linux
```bash
./update-ngrok-url.sh
```

#### Windows
```cmd
update-ngrok-url.bat
```

### Node.js Backend

**All Platforms:**
```bash
cd backend
npm start
```

### Frontend

**All Platforms:**
```bash
cd frontend
npm run dev
```

## 🧪 Testing

### macOS/Linux
```bash
./test-integration.sh
# Or with PDF URL
./test-integration.sh https://example.com/document.pdf
```

### Windows
```cmd
test-integration.bat
REM Or with PDF URL
test-integration.bat https://example.com/document.pdf
```

## 📁 Scripts Available

### macOS/Linux
- `start-python-server.sh` - Start Python server with ngrok
- `update-ngrok-url.sh` - Update backend .env with ngrok URL
- `test-integration.sh` - Test the integration

### Windows
- `start-python-server.bat` - Start Python server with ngrok
- `update-ngrok-url.bat` - Update backend .env with ngrok URL
- `test-integration.bat` - Test the integration

## ⚙️ Environment Configuration

### Backend `.env` (All Platforms)

```env
# Database
MONGODB_URI=your_mongodb_connection_string

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

### Python Server `.env` (All Platforms)

```env
PORT=5000
```

## 🔧 Platform-Specific Notes

### macOS/Linux
- Use forward slashes `/` for paths
- Scripts have `.sh` extension
- Activate venv: `source venv/bin/activate`
- Make scripts executable: `chmod +x script.sh`

### Windows
- Use backslashes `\` for paths
- Scripts have `.bat` extension
- Activate venv: `venv\Scripts\activate`
- Run batch files directly: `script.bat`

## 🐛 Troubleshooting

### Python Virtual Environment Issues

#### macOS/Linux
If you get "externally managed environment" error:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Windows
If pip is not found:
```cmd
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Port Already in Use

#### macOS/Linux
```bash
lsof -i :5000
kill -9 <PID>
```

#### Windows
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### ngrok Issues

**All Platforms:**
1. Check ngrok is running: Visit `http://localhost:4040`
2. Verify authtoken: `ngrok config check`
3. Restart ngrok: `ngrok http 5000`

## 📊 Common Commands Comparison

| Task | macOS/Linux | Windows |
|------|-------------|---------|
| Activate venv | `source venv/bin/activate` | `venv\Scripts\activate` |
| Start Python | `python3 server.py` | `python server.py` |
| Run script | `./script.sh` | `script.bat` |
| Path separator | `/` | `\` |
| Check port | `lsof -i :5000` | `netstat -ano \| findstr :5000` |
| Kill process | `kill -9 <PID>` | `taskkill /PID <PID> /F` |

## ✅ Quick Verification

After setup, verify everything is working:

1. **Python Server:** `curl http://localhost:5000/health`
2. **Backend:** `curl http://localhost:3000/api/verification/health`
3. **ngrok:** Visit `http://localhost:4040/status`

## 📚 Additional Resources

- [Full Integration Guide](./INTEGRATION_GUIDE.md)
- [Python Server Setup](./PYTHON_SERVER_SETUP.md)
- [Quick Reference](./QUICK_REFERENCE.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)

## 💡 Tips

1. **Always use virtual environments** to avoid system-wide package conflicts
2. **Keep ngrok running** in a separate terminal/command prompt
3. **Update backend .env** after restarting ngrok
4. **Use absolute paths** in configuration files
5. **Check firewall settings** if servers can't communicate

---

For platform-specific issues, refer to the troubleshooting section or open an issue on GitHub.
