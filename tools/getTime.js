import { z } from "zod";
import { textContent } from "../utils/response.js";

export function registerGetTime(server) {
  server.tool(
    "get_time",
    "MCP 서버의 현재 시간을 ISO-8601 형식으로 반환합니다.",
    {
      timezone: z.string().optional().describe("타임존 (예: Asia/Seoul). 생략 시 UTC"),
    },
    {
      title: "서버 시간 조회",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
    async ({ timezone }) => {
      const now = new Date();
      const display = timezone
        ? now.toLocaleString("ko-KR", { timeZone: timezone })
        : now.toISOString();
      return textContent(display);
    }
  );
}
