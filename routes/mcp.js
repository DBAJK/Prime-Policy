import { Router } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { createMcpServer } from "../mcpServer.js";
import { config } from "../config.js";
import { validateMcpRequest } from "../middleware/validateRequest.js";

const router = Router();

// Session store for stateful mode.
const sessions = new Map();

router.post("/", validateMcpRequest, async (req, res) => {
  try {
    if (config.stateless) {
      // Stateless: fresh server + transport per request.
      const server = createMcpServer();
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // stateless — no session id
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      return;
    }

    // Stateful: reuse transport per session.
    const sessionId = req.headers["mcp-session-id"];

    if (sessionId && sessions.has(sessionId)) {
      const transport = sessions.get(sessionId);
      await transport.handleRequest(req, res, req.body);
      return;
    }

    if (!isInitializeRequest(req.body)) {
      return res.status(400).json({ error: "No active session. Send initialize first." });
    }

    const server = createMcpServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
      onsessioninitialized: (id) => sessions.set(id, transport),
    });
    transport.onclose = () => sessions.delete(transport.sessionId);
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error("MCP handler error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.get("/", validateMcpRequest, async (req, res) => {
  const sessionId = req.headers["mcp-session-id"];
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(400).json({ error: "Invalid or missing session id" });
  }
  const transport = sessions.get(sessionId);
  await transport.handleRequest(req, res);
});

router.delete("/", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"];
  if (sessionId && sessions.has(sessionId)) {
    const transport = sessions.get(sessionId);
    await transport.close();
    sessions.delete(sessionId);
  }
  res.status(200).json({ ok: true });
});

export default router;
