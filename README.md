# Prime-Policy MCP Server

Remote MCP server for **PlayMCP**, implementing the **Streamable HTTP** transport
with the official [`@modelcontextprotocol/sdk`](https://www.npmjs.com/package/@modelcontextprotocol/sdk).
Runs **stateless** by default (PlayMCP recommended) and exposes 5 tools.

- MCP Spec: 2025-03-26 ~ 2025-11-25
- Transport: Streamable HTTP (`POST /mcp`)
- Health: `GET /health`
- No stdio (PlayMCP does not support stdio)

## Tools

| Name                 | Description                                              | read-only | open-world | idempotent |
| -------------------- | -------------------------------------------------------- | :-------: | :--------: | :--------: |
| `hello`              | Connectivity check / greeting.                           |     ✅    |     ❌     |     ✅     |
| `get_time`           | Current server time (ISO-8601 + optional timezone).      |     ✅    |     ❌     |     ❌     |
| `policy_search`      | Search policies by keyword / category / region.          |     ✅    |     ✅     |     ✅     |
| `policy_categories`  | List available policy categories.                        |     ✅    |     ❌     |     ✅     |
| `policy_detail`      | Full details of a single policy by id.                   |     ✅    |     ✅     |     ✅     |

Every tool declares `annotations` (`title`, `readOnlyHint`, `destructiveHint`,
`openWorldHint`, `idempotentHint`) as required by PlayMCP.

## Project structure

```
Prime-Policy
├── Dockerfile
├── package.json
├── server.js          # Express app + lifecycle
├── mcpServer.js       # McpServer factory
├── config.js
├── routes/            # health.js, mcp.js (Streamable HTTP)
├── tools/             # one file per tool + registry.js + index.js
├── services/          # policyService.js (data access)
├── middleware/        # logger.js, errorHandler.js
├── data/              # policy.json (sample dataset)
└── utils/             # response.js
```

## Run locally

```bash
npm install
npm start          # PORT defaults to 8080
# health
curl http://localhost:8080/health
```

### Quick MCP smoke test (curl)

The Streamable HTTP transport requires the `Accept` header to allow both JSON
and SSE.

```bash
# initialize
curl -s http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"0"}}}'

# tools/list
curl -s http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'

# tools/call
curl -s http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"policy_search","arguments":{"query":"청년 주거"}}}'
```

## MCP Inspector (validate before registering)

```bash
npx @modelcontextprotocol/inspector
```

In the Inspector UI:

1. Transport type: **Streamable HTTP**
2. URL: `http://localhost:8080/mcp`
3. Connect → run `initialize`, `tools/list`, then `tools/call`.

## Docker

```bash
docker build -t prime-policy .
docker run -p 8080:8080 prime-policy
```

## PlayMCP registration

1. Push to GitHub over **HTTPS** (not SSH):
   `https://github.com/DBAJK/Prime-Policy.git`
2. PlayMCP clones the repo and builds the `Dockerfile` with Kaniko.
3. Endpoint exposed to PlayMCP: `POST /mcp` (Streamable HTTP).
4. Auth: extend `routes/mcp.js` with OAuth or a custom header if required.

## Data

`data/policy.json` ships with sample Korean public-support policies. Replace it
with your real dataset — `services/policyService.js` reads from this file and
caches it in memory.
