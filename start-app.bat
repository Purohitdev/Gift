@echo off
echo ===================================
echo Gift Shop E-commerce Starter Script
echo ===================================

echo Checking MongoDB connection...
curl -X POST http://localhost:3000/api/seed-db

echo.
echo Starting development server...
npm run dev