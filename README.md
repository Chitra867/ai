# AI-Based Insider Threat & Malware Detection System

A comprehensive full-stack web application designed specifically for financial institutions in the Kathmandu Valley, featuring AI-powered threat detection, malware scanning, and behavioral analytics.

## 🌟 Features

### Core Functionality
- **AI-Powered Threat Detection**: Advanced machine learning algorithms for insider threat detection
- **Real-time Malware Scanning**: Upload and scan files for malware with AI analysis
- **Behavioral Analytics**: Monitor user behavior patterns and detect anomalies
- **Risk Assessment**: Comprehensive risk scoring and threat categorization
- **Interactive Dashboard**: Real-time system health and threat overview
- **Detailed Reports**: Generate PDF reports with charts and analytics

### Security Features
- **JWT Authentication**: Secure user authentication and authorization
- **Role-based Access Control**: Admin, Analyst, and Viewer roles
- **File Quarantine**: Automatic quarantine of infected files
- **Audit Trails**: Complete logging of all system activities
- **Rate Limiting**: Protection against brute force attacks

### User Interface
- **Dark Theme**: Professional dark theme inspired by "Have I Been Pwned"
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live notifications and status updates
- **Interactive Charts**: Visualize threat trends and statistics
- **Smooth Animations**: Framer Motion animations for better UX

## 🎨 Design System

### Color Palette
- **Background**: `#1B1B1B` (Charcoal Black)
- **Text**: `#E0E0E0` (White Smoke)
- **Primary Button**: `#2E89C1` (Medium Slate Blue)
- **Accent/Border**: `#555555` (Slate Gray)
- **Alert**: `#D9534F` (Crimson)
- **Success**: `#5CB85C` (Sea Green)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB 4.4+

### Installation & Setup
```bash
# Backend Setup
cd backend
npm install
# Configure environment variables in .env file
npm run dev

# Frontend Setup (in new terminal)
cd frontend
npm install
npm start
```

### Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
ai-threat-detection/
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts
│   │   ├── services/         # API services
│   │   └── ...
├── backend/                   # Node.js backend application
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── models/           # MongoDB models
│   │   ├── services/         # AI services
│   │   └── ...
└── README.md
```

## 🔑 Implemented Features

1. **Landing Page** - Attractive dark-themed design with animations
2. **Authentication** - Secure login/signup with JWT
3. **Dashboard** - Real-time system monitoring
4. **Threat Analysis** - AI-powered log analysis
5. **Malware Scanner** - File upload and scanning
6. **Reports** - Comprehensive security reports
7. **Settings** - User and system configuration

## 🤖 AI Services

Mock AI implementation includes:
- Threat pattern recognition
- Behavioral anomaly detection
- Malware signature analysis
- Risk assessment algorithms

## 🛠️ Technologies

**Frontend**: React, TypeScript, Tailwind CSS, Framer Motion, Recharts
**Backend**: Node.js, Express, MongoDB, JWT, Multer
**Security**: Helmet, CORS, Rate Limiting, Input Validation

## 📊 Usage

1. Visit http://localhost:3000
2. Sign up or login
3. Access dashboard for system overview
4. Upload files for malware scanning
5. Analyze threat logs
6. Generate security reports
7. Configure system settings

---

**Built for Financial Institutions in Kathmandu Valley**