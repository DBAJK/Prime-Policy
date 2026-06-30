export const config = {
  port: Number(process.env.PORT) || 8080,
  serverName: process.env.MCP_SERVER_NAME || "prime-policy",
  serverVersion: process.env.MCP_SERVER_VERSION || "1.0.0",
  stateless: process.env.MCP_STATELESS !== "false",
  youthApiKey: process.env.YOUTH_API_KEY || "",
  youthApiBaseUrl: "https://www.youthcenter.go.kr/opi",
};
