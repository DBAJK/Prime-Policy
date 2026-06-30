import { z } from "zod";
import { getPoliciesByCategory } from "../services/youthPolicyService.js";
import { jsonContent, errorContent } from "../utils/response.js";
import { CATEGORIES } from "../utils/constants.js";

export function registerPolicyCategory(server) {
  server.tool(
    "policy_category",
    "분야별 청년 정책을 조회합니다.",
    {
      category: z.enum(Object.keys(CATEGORIES)).describe("정책 분야 (일자리, 주거, 교육, 복지문화, 참여권리)"),
      page: z.number().int().min(1).optional().default(1).describe("페이지 번호"),
    },
    {
      title: "분야별 정책 조회",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    async ({ category, page }) => {
      try {
        const { total, items } = await getPoliciesByCategory(category, page);
        if (!items.length) return jsonContent({ message: "해당 분야의 정책이 없습니다.", category });
        return jsonContent({ total, category, page, count: items.length, policies: items });
      } catch (e) {
        return errorContent(e.message);
      }
    }
  );
}
