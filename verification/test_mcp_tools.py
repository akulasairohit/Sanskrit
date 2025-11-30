import asyncio
import os
import sys
from dotenv import load_dotenv
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# Load environment variables
load_dotenv()

# Add src to python path
sys.path.append(os.path.join(os.getcwd(), "src"))

async def run():
    print("🚀 Starting MCP Client Verification...")
    
    server_params = StdioServerParameters(
        command="python3",
        args=["-m", "sanskrit_mcp"],
        env={**os.environ, "PYTHONPATH": "src"}
    )

    try:
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                
                print("✅ MCP Session Initialized")
                
                tools = await session.list_tools()
                print(f"🛠️  Available Tools ({len(tools.tools)}):")
                for tool in tools.tools:
                    print(f"   - {tool.name}: {tool.description}")
                
                required_tools = [
                    "register_agent", 
                    "send_sanskrit_message", 
                    "translate_sanskrit", 
                    "query_vedic_knowledge"
                ]
                
                missing = [t for t in required_tools if not any(rt.name == t for rt in tools.tools)]
                
                if missing:
                    print(f"❌ Missing required tools: {missing}")
                else:
                    print("✅ All required tools are present.")

    except Exception as e:
        print(f"❌ MCP Verification Error: {e}")

if __name__ == "__main__":
    asyncio.run(run())
