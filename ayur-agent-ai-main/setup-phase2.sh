#!/bin/bash

# 🚀 AyurAgent AI - Quick Setup Script
# This script installs all Phase 2 dependencies and runs initial tests

echo "=========================================="
echo "   AyurAgent AI - Phase 2 Setup"
echo "=========================================="
echo ""

# Install Phase 2 testing dependencies
echo "📦 Installing testing dependencies..."
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8

echo ""
echo "✅ Dependencies installed!"
echo ""

# Run tests
echo "🧪 Running test suite..."
npm test

echo ""
echo "=========================================="
echo "   Setup Complete!"
echo "=========================================="
echo ""
echo "Available commands:"
echo "  npm test              - Run tests"
echo "  npm run test:ui       - Open test UI"
echo "  npm run test:coverage - Generate coverage report"
echo "  npm run test:watch    - Watch mode"
echo ""
echo "📚 Documentation:"
echo "  - COMPREHENSIVE_TEST_REPORT.md"
echo "  - DEPLOYMENT_CHECKLIST.md"
echo "  - PHASE2_SETUP_GUIDE.md"
echo "  - COMPLETE_SUMMARY.md"
echo ""
echo "🔴 CRITICAL REMINDER:"
echo "  Revoke exposed API key at: https://console.cloud.google.com/"
echo "  Generate new key and update .env file"
echo ""
