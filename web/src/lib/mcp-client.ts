import { spawn, ChildProcess } from "child_process";
import path from "path";

// Define types for MCP JSON-RPC
type JsonRpcRequest = {
    jsonrpc: "2.0";
    method: string;
    params?: any;
    id: number | string;
};

type JsonRpcResponse = {
    jsonrpc: "2.0";
    result?: any;
    error?: any;
    id: number | string;
};

class SanskritMCPClient {
    private process: ChildProcess | null = null;
    private requestCounter = 0;
    private pendingRequests = new Map<
        number | string,
        { resolve: (value: any) => void; reject: (reason?: any) => void }
    >();
    private buffer = "";

    private initialized = false;
    private initializationPromise: Promise<void> | null = null;

    constructor() {
        // Lazy initialization on first call
    }

    private async startServer() {
        if (this.process) return;

        console.log("Starting Sanskrit MCP Server...");
        // Assuming the python environment is set up and 'python3' is available
        // We need to run this from the root of the repo ideally, or set PYTHONPATH
        const repoRoot = path.resolve(process.cwd(), ".."); // Assuming web/ is inside the repo

        // In production/deployment, this path resolution might need adjustment
        // For local dev, we are in /Applications/My Repos/Sanskrit/web

        this.process = spawn("python3", ["-m", "sanskrit_mcp"], {
            cwd: repoRoot,
            env: { ...process.env, PYTHONPATH: "src" },
            stdio: ["pipe", "pipe", "inherit"], // pipe stdin/stdout, inherit stderr for logs
        });

        this.process.stdout?.on("data", (data) => {
            this.buffer += data.toString();
            this.processBuffer();
        });

        this.process.on("error", (err) => {
            console.error("MCP Server Error:", err);
        });

        this.process.on("exit", (code) => {
            console.log(`MCP Server exited with code ${code}`);
            this.process = null;
            this.initialized = false;
            this.initializationPromise = null;
        });
    }

    private async initialize() {
        if (this.initialized) return;
        if (this.initializationPromise) return this.initializationPromise;

        this.initializationPromise = (async () => {
            await this.startServer();

            const id = this.requestCounter++;
            const initRequest: JsonRpcRequest = {
                jsonrpc: "2.0",
                method: "initialize",
                params: {
                    protocolVersion: "2024-11-05",
                    capabilities: {},
                    clientInfo: { name: "sanskrit-web-client", version: "1.0.0" }
                },
                id,
            };

            await new Promise<void>((resolve, reject) => { // Explicitly type Promise to void
                this.pendingRequests.set(id, { resolve, reject });
                const msg = JSON.stringify(initRequest) + "\n";
                this.process?.stdin?.write(msg);
            });

            console.log("MCP Initialization response received");

            // Send initialized notification
            const notification = {
                jsonrpc: "2.0",
                method: "notifications/initialized"
            };
            this.process?.stdin?.write(JSON.stringify(notification) + "\n");

            // Wait a bit for server to process notification
            await new Promise((resolve) => setTimeout(resolve, 500));

            this.initialized = true;
            console.log("MCP Client Initialized");
        })();

        return this.initializationPromise;
    }

    private processBuffer() {
        const lines = this.buffer.split("\n");
        // Keep the last chunk if it's incomplete
        this.buffer = lines.pop() || "";

        for (const line of lines) {
            if (!line.trim()) continue;
            try {
                const response: JsonRpcResponse = JSON.parse(line);
                if (response.id !== undefined && this.pendingRequests.has(response.id)) {
                    const { resolve, reject } = this.pendingRequests.get(response.id)!;
                    if (response.error) {
                        reject(response.error);
                    } else {
                        resolve(response.result);
                    }
                    this.pendingRequests.delete(response.id);
                }
            } catch (e) {
                console.error("Failed to parse JSON-RPC response:", line, e);
            }
        }
    }

    public async callTool(toolName: string, args: any) {
        await this.initialize();

        const id = this.requestCounter++;
        const request: JsonRpcRequest = {
            jsonrpc: "2.0",
            method: "tools/call",
            params: {
                name: toolName,
                arguments: args,
            },
            id,
        };

        return new Promise((resolve, reject) => {
            this.pendingRequests.set(id, { resolve, reject });
            const msg = JSON.stringify(request) + "\n";
            this.process?.stdin?.write(msg);
        });
    }

    public async listTools() {
        await this.initialize();

        const id = this.requestCounter++;
        const request: JsonRpcRequest = {
            jsonrpc: "2.0",
            method: "tools/list",
            id,
        };

        return new Promise((resolve, reject) => {
            this.pendingRequests.set(id, { resolve, reject });
            const msg = JSON.stringify(request) + "\n";
            this.process?.stdin?.write(msg);
        });
    }

    public async readResource(uri: string) {
        await this.initialize();

        const id = this.requestCounter++;
        const request: JsonRpcRequest = {
            jsonrpc: "2.0",
            method: "resources/read",
            params: {
                uri
            },
            id,
        };

        return new Promise((resolve, reject) => {
            this.pendingRequests.set(id, { resolve, reject });
            const msg = JSON.stringify(request) + "\n";
            this.process?.stdin?.write(msg);
        });
    }
}

// Singleton instance for the server-side
// In Next.js dev mode, global is preserved across reloads
const globalForMCP = global as unknown as { mcpClient: SanskritMCPClient };

export const mcpClient = globalForMCP.mcpClient || new SanskritMCPClient();

if (process.env.NODE_ENV !== "production") globalForMCP.mcpClient = mcpClient;
