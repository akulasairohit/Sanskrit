#!/bin/bash

# Sanskrit MCP Server Setup Script (Python)
# Run this script to set up the Python environment

echo "🕉️ Setting up Sanskrit Agent Communication System..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed."
    echo "📥 Please install Python 3.11 or higher from https://python.org/"
    echo "   Or use a package manager:"
    echo "   - macOS: brew install python@3.11"
    echo "   - Ubuntu: sudo apt install python3.11 python3.11-venv"
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
REQUIRED_VERSION="3.11.0"

python3 -c "
import sys
current = tuple(map(int, sys.version.split()[0].split('.')))
required = tuple(map(int, '$REQUIRED_VERSION'.split('.')))
if current < required:
    print('❌ Python version is too old. Please upgrade to $REQUIRED_VERSION or higher.')
    sys.exit(1)
"

if [ $? -ne 0 ]; then
    exit 1
fi

echo "✅ Python version $PYTHON_VERSION detected"

# Navigate to project directory
cd "$(dirname "$0")/.."

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    
    if [ $? -eq 0 ]; then
        echo "✅ Virtual environment created"
    else
        echo "❌ Failed to create virtual environment"
        exit 1
    fi
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip > /dev/null 2>&1

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Install package in development mode
echo "🔨 Installing sanskrit_mcp package..."
pip install -e .

if [ $? -eq 0 ]; then
    echo "✅ Package installed successfully"
else
    echo "❌ Package installation failed"
    exit 1
fi

# Run basic tests
echo "🧪 Running validation tests..."

# Test 1: Check imports
echo "📝 Test 1: Validating package imports..."
python3 -c "
try:
    from sanskrit_mcp.lib.types import Agent, SanskritCapabilities
    from sanskrit_mcp.lib.sanskrit_validator import SanskritValidator
    from sanskrit_mcp.lib.vedic_corpus_parser import VedicCorpusParser
    print('✅ Package import validation passed')
except Exception as e:
    print(f'❌ Import validation failed: {e}')
    exit(1)
"

if [ $? -ne 0 ]; then
    exit 1
fi

# Test 2: Run simple test
echo "📝 Test 2: Running functionality test..."
python3 examples/simple_test.py > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Functionality test passed"
else
    echo "❌ Functionality test failed"
    exit 1
fi

echo ""
echo "🎉 Sanskrit MCP Server setup completed successfully!"
echo ""
echo "🚀 To start using:"
echo "   • Run examples:    python examples/simple_test.py"
echo "   • Start MCP server: python -m sanskrit_mcp"
echo "   • Or use helper:    ./scripts/run-server.sh"
echo ""
echo "� Available examples:"
echo "   • simple_test.py       - Basic validation demo"
echo "   • vedanta_debate.py    - Philosophical debate"
echo "   • gajendra_moksha.py   - Interactive learning"
echo ""
echo "📚 See README.md for detailed usage instructions"
echo "🕉️ नमस्कार! Your Sanskrit agent communication system is ready!"