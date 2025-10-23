#!/bin/bash
# Wrapper script to run Sanskrit MCP server with proper Node.js path

source ~/.nvm/nvm.sh
nvm use node > /dev/null 2>&1

# Run the server
exec node /Users/sairohit/Sanskrit/mcp-server/dist/index.js "$@"
