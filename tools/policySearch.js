import { z } from "zod";
import { searchPolicies } from "../services/youthPolicyService.js";
import { jsonContent, errorContent } from "../utils/response.js";

export function registerPolicySearch(server) {
  server.tool(
    "policy_search",
    "키워드로 청년 정책을 검색합니다.",
    {
      keyword: z.string().describe("검색 키워드 (예: 청년취업, 주거지원)"),
      page: z.number().int().min(1).optional().default(1).describe("페이지 번호"),
    },
    {
      title: "정책 키워드 검색",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    async ({ keyword, page }) => {
      try {
        const { total, items } = await searchPolicies(keyword, page);
        if (!items.length) return jsonContent({ message: "검색 결과가 없습니다.", keyword });
        return jsonContent({ total, page, count: items.length, policies: items });
      } catch (e) {
        return errorContent(e.message);
      }
    }
  );
}
