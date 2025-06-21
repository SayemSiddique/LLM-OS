@echo off
REM LLM-OS Setup Script for Windows
REM This script will install dependencies and set up your LLM Operating System

echo 🚀 Setting up LLM-OS - The Future of AI Computing
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo 📝 Creating environment configuration...
    copy .env.example .env.local
    echo ⚠️  Please edit .env.local with your API keys before running the app
) else (
    echo ✅ Environment configuration found
)

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔥 Installing Firebase CLI...
    call npm install -g firebase-tools
) else (
    echo ✅ Firebase CLI found
)

echo.
echo 🎉 LLM-OS setup complete!
echo.
echo Next steps:
echo 1. Edit .env.local with your API keys:
echo    - Firebase configuration
echo    - OpenAI API key
echo    - OpenRouter API key (optional)
echo.
echo 2. Initialize Firebase (optional):
echo    npm run firebase:init
echo.
echo 3. Start the development server:
echo    npm run dev
echo.
echo 4. Open http://localhost:3000 in your browser
echo.
echo 📚 Read the README.md for detailed setup instructions
echo 🌟 Welcome to the future of AI computing!
echo.
pause
