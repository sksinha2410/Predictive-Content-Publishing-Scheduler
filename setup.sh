#!/bin/bash

# Predictive Content Publishing Scheduler - Quick Setup Script
# This script helps set up the project quickly

echo "🚀 Setting up Predictive Content Publishing Scheduler..."
echo ""

# Check for Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "📝 Creating backend .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and add your MongoDB URI and OpenAI API key"
else
    echo "✅ Backend .env file already exists"
fi

echo "📦 Installing backend dependencies..."
npm install

cd ..

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd frontend

if [ ! -f ".env" ]; then
    echo "📝 Creating frontend .env file..."
    cp .env.example .env
    echo "✅ Frontend .env file created (using defaults)"
else
    echo "✅ Frontend .env file already exists"
fi

echo "📦 Installing frontend dependencies (this may take a few minutes)..."
npm install

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit backend/.env with your MongoDB URI and OpenAI API key"
echo "2. Seed the database: cd backend && node seed.js"
echo "3. Start backend: cd backend && npm run dev"
echo "4. In a new terminal, start frontend: cd frontend && npm start"
echo ""
echo "📚 For detailed instructions, see README.md"
echo "🎬 For demo walkthrough, see DEMO_GUIDE.md"
echo ""
