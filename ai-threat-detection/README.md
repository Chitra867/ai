# AI-Based Insider Threat & Malware Detection System

A comprehensive, full-stack AI-powered cybersecurity solution designed specifically for financial institutions in the Kathmandu Valley. This system provides advanced threat detection, malware analysis, and security monitoring capabilities with a modern, dark-themed user interface.

## 🚀 Features

### Frontend
- **Dark-themed UI** with "Have I Been Pwned" inspired color palette
- **Responsive design** for desktop and mobile devices
- **Real-time dashboard** with system health metrics and threat visualization
- **AI-powered threat analysis** with risk level indicators
- **Malware scanner** with drag-and-drop file upload
- **Interactive risk reports** with charts and PDF export
- **System logs viewer** with real-time updates and filtering
- **User settings** with API key management and preferences
- **Secure authentication** with JWT tokens

### Backend
- **RESTful API** built with Node.js, Express, and TypeScript
- **MongoDB database** with Mongoose ODM
- **JWT authentication** with role-based access control
- **File upload handling** with Multer
- **Mock AI services** for threat detection and malware analysis
- **Rate limiting** and security middleware
- **Comprehensive logging** and audit trails
- **CORS configuration** for frontend integration

### AI Integration
- **Behavioral pattern detection** for insider threats
- **Malware prediction algorithms** (mock implementation)
- **Smart dashboard summaries** with AI insights
- **Risk assessment** with threat level classification
- **Anomaly detection** in user behavior patterns

## 🛠️ Technology Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API communication
- **Recharts** for data visualization
- **jsPDF** for PDF generation
- **html2canvas** for chart exports

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Helmet** for security headers
- **Morgan** for logging
- **CORS** for cross-origin requests

## 📁 Project Structure

```
ai-threat-detection/
├── backend/
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Authentication & security
│   │   ├── services/        # Business logic & AI services
│   │   └── index.ts         # Server entry point
│   ├── uploads/             # File upload directory
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   └── App.tsx          # Main app component
│   ├── public/
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-threat-detection
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your MongoDB connection string and JWT secret
   
   # Start the backend server
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Start the frontend development server
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Environment Variables

**Backend (.env)**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/threat-detection
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:3001/api
GENERATE_SOURCEMAP=false
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Dashboard
- `GET /api/dashboard` - Get dashboard data

### Threat Analysis
- `GET /api/threats` - Get threat analyses
- `POST /api/threats/analyze` - Analyze log file

### Malware Scanner
- `GET /api/malware` - Get malware scans
- `POST /api/malware/scan` - Scan file for malware

### Reports
- `GET /api/reports` - Get risk reports data

### System Logs
- `GET /api/logs` - Get system logs
- `DELETE /api/logs` - Clear logs
- `GET /api/logs/export` - Export logs as CSV

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings
- `PUT /api/settings/password` - Change password
- `POST /api/settings/api-keys` - Generate API key
- `DELETE /api/settings/api-keys/:id` - Revoke API key

## 🎨 Design System

### Color Palette (Have I Been Pwned Inspired)
- **Primary Blue**: #3b82f6 (Blue-500)
- **Dark Gray**: #111827 (Gray-900)
- **Medium Gray**: #374151 (Gray-700)
- **Light Gray**: #9ca3af (Gray-400)
- **Success Green**: #10b981 (Green-600)
- **Warning Yellow**: #f59e0b (Yellow-500)
- **Danger Red**: #ef4444 (Red-500)

### Typography
- **Font Family**: Inter
- **Headings**: Font weights 600-700
- **Body Text**: Font weight 400
- **UI Elements**: Font weight 500

## 🔒 Security Features

- **JWT-based authentication** with secure token storage
- **Password hashing** using bcryptjs
- **Rate limiting** to prevent brute force attacks
- **CORS configuration** for secure cross-origin requests
- **Input validation** and sanitization
- **File upload restrictions** with type validation
- **Security headers** via Helmet middleware
- **Audit logging** for all user actions

## 🤖 AI Features (Mock Implementation)

- **Threat Detection**: Simulated AI analysis of log files
- **Malware Analysis**: Mock malware scanning with risk assessment
- **Behavioral Analysis**: User activity pattern detection
- **Risk Scoring**: Automated threat level classification
- **Smart Insights**: AI-generated security recommendations

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured dashboard experience
- **Tablet**: Adapted layouts with touch-friendly interfaces
- **Mobile**: Streamlined UI with essential features

## 🚀 Deployment

### Production Build
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Serve the build folder with a static server
```

### Docker Support (Future Enhancement)
Docker configurations can be added for containerized deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Real AI Integration**: Replace mock services with actual ML models
- **Advanced Analytics**: More sophisticated threat analysis
- **Multi-tenant Support**: Support for multiple organizations
- **Mobile App**: Native mobile applications
- **API Documentation**: Swagger/OpenAPI documentation
- **Automated Testing**: Comprehensive test suites
- **CI/CD Pipeline**: Automated deployment workflows
- **Docker Support**: Containerization for easy deployment

---

**Built with ❤️ for the financial institutions of Kathmandu Valley**