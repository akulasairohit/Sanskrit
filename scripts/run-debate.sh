#!/bin/bash

# Vedanta Truth Debate Runner
# This script runs the Advaita vs Dvaita debate

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║         VEDANTA TRUTH DEBATE - Starting...                   ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check if node is available
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Navigate to the mcp-server directory
cd "$(dirname "$0")"

# Run the debate
node examples/vedanta-truth-debate.mjs

# Check if it ran successfully
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Debate completed successfully!"
    echo "📝 Check VEDANTA_TRUTH_DEBATE.md for the full summary"
else
    echo ""
    echo "❌ Debate encountered an error"
    exit 1
fi
