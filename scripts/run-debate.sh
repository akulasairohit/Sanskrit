#!/bin/bash

# Vedanta Debate Runner (Python)
# This script runs the Advaita vs Dvaita debate

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║         VEDANTA DEBATE - Starting...                         ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed or not in PATH"
    echo "Please install Python 3.11+ from https://python.org/"
    exit 1
fi

# Navigate to project root
cd "$(dirname "$0")/.."

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Run the debate
python3 examples/vedanta_debate.py

# Check if it ran successfully
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Debate completed successfully!"
else
    echo ""
    echo "❌ Debate encountered an error"
    exit 1
fi
