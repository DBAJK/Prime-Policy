import { z } from "zod";
import { recommendPolicies } from "../services/youthPolicyService.js";
import { jsonContent, errorContent } from "../utils/response.js";
import { REGIONS } from "../utils/constants.js";

export function registerPolicyRecommend(server) {
  server.tool(
    "policy_recommend",
    "나이, 지역, 취업 상태를 기반으로 맞춤 청년 정책을 추천합니다.",
    {
      age: z.number().int().min(15).max(39).describe("나이 (15~39세)"),
      region: z.enum(Object.keys(REGIONS)).optional().describe("거주 지역 (예: 서울, 경기)"),
      employment: z.enum(["미취업", "재직", "자영업", "프리랜서"]).optional().describe("취업 상태"),
    },
    {
      title: "맞춤 정책 추천",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
    async ({ age, region, employment }) => {
      try {
        const { total, items } = await recommendPolicies({ age, region, employment });
        if (!items.length) return jsonContent({ message: "조건에 맞는 정책을 찾지 못했습니다.", conditions: { age, region, employment } });
        return jsonContent({ total, conditions: { age, region, employment }, policies: items });
      } catch (e) {
        return errorContent(e.message);
      }
    }
  );
}
