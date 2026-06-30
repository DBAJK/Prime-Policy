import { z } from "zod";
import { getPoliciesByRegion } from "../services/youthPolicyService.js";
import { jsonContent, errorContent } from "../utils/response.js";
import { REGIONS } from "../utils/constants.js";

export function registerPolicyRegion(server) {
  server.tool(
    "policy_region",
    "지역별 청년 정책을 조회합니다.",
    {
      region: z.enum(Object.keys(REGIONS)).describe("지역명 (예: 서울, 경기, 부산)"),
      page: z.number().int().min(1).optional().default(1).describe("페이지 번호"),
    },
    {
      title: "지역별 정책 조회",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    async ({ region, page }) => {
      try {
        const { total, items } = await getPoliciesByRegion(region, page);
        if (!items.length) return jsonContent({ message: "해당 지역의 정책이 없습니다.", region });
        return jsonContent({ total, region, page, count: items.length, policies: items });
      } catch (e) {
        return errorContent(e.message);
      }
    }
  );
}
