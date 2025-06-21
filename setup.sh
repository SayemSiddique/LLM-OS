#!/bin/bash

# LLM-OS Setup Script
# This script will install dependencies and set up your LLM Operating System

echo "🚀 Setting up LLM-OS - The Future of AI Computing"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating environment configuration..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local with your API keys before running the app"
else
    echo "✅ Environment configuration found"
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "🔥 Installing Firebase CLI..."
    npm install -g firebase-tools
else
    echo "✅ Firebase CLI found"
fi

echo ""
echo "🎉 LLM-OS setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your API keys:"
echo "   - Firebase configuration"
echo "   - OpenAI API key"
echo "   - OpenRouter API key (optional)"
echo ""
echo "2. Initialize Firebase (optional):"
echo "   npm run firebase:init"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Read the README.md for detailed setup instructions"
echo "🌟 Welcome to the future of AI computing!"
