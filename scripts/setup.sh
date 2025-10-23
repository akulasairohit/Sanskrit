#!/bin/bash

# Sanskrit MCP Server Setup Script
# Run this script when Node.js is available on your system

echo "🕉️ Setting up Sanskrit Agent Communication System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "📥 Please install Node.js from https://nodejs.org/ (version 18 or higher)"
    echo "   Or use a package manager:"
    echo "   - macOS: brew install node"
    echo "   - Ubuntu: sudo apt install nodejs npm"
    echo "   - Windows: Download from nodejs.org"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! node -e "
    const current = process.version.slice(1).split('.').map(Number);
    const required = '$REQUIRED_VERSION'.split('.').map(Number);
    const isValid = current[0] > required[0] || 
                   (current[0] === required[0] && current[1] >= required[1]);
    process.exit(isValid ? 0 : 1);
"; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to version $REQUIRED_VERSION or higher."
    exit 1
fi

echo "✅ Node.js version $(node --version) detected"

# Navigate to project directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the project
echo "🔨 Building TypeScript project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Project built successfully"
else
    echo "❌ Build failed. Check TypeScript errors above."
    exit 1
fi

# Run basic tests
echo "🧪 Running basic validation tests..."

# Test 1: Check if main server file can be imported
echo "📝 Test 1: Validating main server structure..."
node -e "
try {
    const path = require('path');
    const fs = require('fs');
    
    // Check if dist directory exists
    if (!fs.existsSync('./dist/index.js')) {
        console.error('❌ Built server file not found');
        process.exit(1);
    }
    
    console.log('✅ Server build validation passed');
} catch (error) {
    console.error('❌ Server validation failed:', error.message);
    process.exit(1);
}
"

# Test 2: Validate package.json structure
echo "📝 Test 2: Validating package configuration..."
node -e "
try {
    const pkg = require('./package.json');
    
    const requiredDeps = [
        '@modelcontextprotocol/sdk',
        'express',
        'zod'
    ];
    
    const missing = requiredDeps.filter(dep => !pkg.dependencies[dep]);
    
    if (missing.length > 0) {
        console.error('❌ Missing dependencies:', missing);
        process.exit(1);
    }
    
    console.log('✅ Package configuration validation passed');
} catch (error) {
    console.error('❌ Package validation failed:', error.message);
    process.exit(1);
}
"

echo ""
echo "🎉 Sanskrit MCP Server setup completed successfully!"
echo ""
echo "🚀 To start the server:"
echo "   • STDIO mode (for MCP clients): npm start -- --stdio"
echo "   • HTTP mode (for web access):   npm start"
echo "   • Development mode:             npm run dev"
echo ""
echo "🛠️ Available npm scripts:"
echo "   • npm run build   - Build TypeScript"
echo "   • npm run dev     - Development with auto-reload"
echo "   • npm start       - Start production server"
echo "   • npm test        - Run tests"
echo "   • npm run lint    - Check code style"
echo ""
echo "📚 See README.md for detailed usage instructions"
echo "🕉️ नमस्कार! Your Sanskrit agent communication system is ready!"