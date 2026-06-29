// Central configuration. Values can be overridden by environment variables,
// which is how PlayMCP / Docker will inject runtime settings.
export const config = {
  port: Number(process.env.PORT) || 8080,
  serverName: process.env.MCP_SERVER_NAME || "prime-policy",
  serverVersion: process.env.MCP_SERVER_VERSION || "1.0.0",
  // Stateless mode is recommended by PlayMCP. Set MCP_STATELESS=false to
  // enable session-based (stateful) Streamable HTTP instead.
  stateless: process.env.MCP_STATELESS !== "false",
};
