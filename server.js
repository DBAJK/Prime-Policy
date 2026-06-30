import express from "express";
import { config } from "./config.js";
import { logger } from "./middleware/logger.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import healthRoutes from "./routes/health.js";
import mcpRoutes from "./routes/mcp.js";
// validateRequest is applied per-route inside routes/mcp.js

const app = express();

app.use(express.json());
app.use(logger);

// Service metadata / discovery.
app.get("/", (_req, res) => {
  res.json({
    name: config.serverName,
    version: config.serverVersion,
    transport: "streamable-http",
    endpoints: { mcp: "POST /mcp", health: "GET /health" },
  });
});

app.use("/health", healthRoutes);
app.use("/mcp", mcpRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`Prime-Policy MCP server listening on port ${config.port}`);
  console.log(`  MCP endpoint:    POST /mcp`);
  console.log(`  Health endpoint: GET  /health`);
  console.log(`  Mode:            ${config.stateless ? "stateless" : "stateful"}`);
});

// Graceful shutdown for container environments (Kaniko/K8s send SIGTERM).
function shutdown() {
  console.log("Shutting down...");
  server.close(() => process.exit(0));
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
