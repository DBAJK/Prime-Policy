import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { config } from "./config.js";
import { registerTools } from "./tools/index.js";

// Factory that builds a fully-configured McpServer with all tools registered.
// In stateless mode a fresh instance is created per request, so this stays cheap.
export function createMcpServer() {
  const server = new McpServer(
    {
      name: config.serverName,
      version: config.serverVersion,
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  registerTools(server);
  return server;
}
