#!/bin/bash
# Wrapper script to run Sanskrit MCP server

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Run the Python MCP server
exec python -m sanskrit_mcp "$@"
