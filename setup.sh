#!/bin/bash

# AgriCoPilot Setup Script
# This script sets up the entire AgriCoPilot application

echo "🌾 AgriCoPilot Setup Script"
echo "============================"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

echo "✅ Node.js and npm found"
echo ""

# Setup Frontend
echo "📦 Setting up Frontend..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend setup failed"
    exit 1
fi
cd ..
echo ""

# Setup Firebase Functions
echo "📦 Setting up Firebase Functions..."
cd firebase/functions
npm install
if [ $? -eq 0 ]; then
    echo "✅ Firebase Functions dependencies installed"
else
    echo "❌ Firebase Functions setup failed"
    exit 1
fi
cd ../..
echo ""

echo "🎉 Setup Complete!"
echo ""
echo "To start the application:"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "The app will open at http://localhost:3000"
echo ""
echo "Optional - To start Firebase emulators:"
echo "  cd firebase"
echo "  firebase emulators:start"
echo ""
echo "Happy farming! 🌾"
