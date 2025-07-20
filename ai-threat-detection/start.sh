#!/bin/bash

echo "🚀 Starting AI-Based Insider Threat & Malware Detection System..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   You can start it with: sudo systemctl start mongod"
    echo "   Or: brew services start mongodb-community (on macOS)"
fi

# Start backend server
echo "🔧 Starting backend server..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "⚠️  Backend .env file not found. Creating from example..."
    cp .env.example .env
    echo "✏️  Please edit backend/.env with your configuration"
fi

npm run dev &
BACKEND_PID=$!
echo "✅ Backend server started (PID: $BACKEND_PID)"

# Start frontend server
echo "🎨 Starting frontend server..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "⚠️  Frontend .env file not found. Creating default..."
    echo "REACT_APP_API_URL=http://localhost:3001/api" > .env
    echo "GENERATE_SOURCEMAP=false" >> .env
fi

npm start &
FRONTEND_PID=$!
echo "✅ Frontend server started (PID: $FRONTEND_PID)"

echo ""
echo "🌟 Application is starting up..."
echo "📊 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID