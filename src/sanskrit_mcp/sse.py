
import logging
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.routing import Route
from mcp.server.sse import SseServerTransport
from sanskrit_mcp.__main__ import app as mcp_app

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create SSE transport
sse = SseServerTransport("/messages")

async def handle_sse(request):
    """Handle SSE connections."""
    async with sse.connect_sse(request.scope, request.receive, request._send) as streams:
        await mcp_app.run(
            streams[0], streams[1], mcp_app.create_initialization_options()
        )

async def handle_messages(request):
    """Handle client messages."""
    await sse.handle_post_message(request.scope, request.receive, request._send)

# Define routes
routes = [
    Route("/sse", endpoint=handle_sse),
    Route("/messages", endpoint=handle_messages, methods=["POST"]),
]

# Middleware configuration
middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins for easy access
        allow_methods=["*"],
        allow_headers=["*"],
    )
]

# Create Starlette app
starlette_app = Starlette(
    debug=True,
    routes=routes,
    middleware=middleware,
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(starlette_app, host="0.0.0.0", port=8000)
