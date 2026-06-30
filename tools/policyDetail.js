import { z } from "zod";
import { getPolicyDetail } from "../services/youthPolicyService.js";
import { jsonContent, errorContent } from "../utils/response.js";

export function registerPolicyDetail(server) {
  server.tool(
    "policy_detail",
    "정책 ID로 청년 정책의 상세 정보를 조회합니다.",
    {
      policyId: z.string().describe("정책 ID (policy_search 결과의 id 필드)"),
    },
    {
      title: "정책 상세 조회",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    async ({ policyId }) => {
      try {
        const policy = await getPolicyDetail(policyId);
        if (!policy) return jsonContent({ message: "해당 정책을 찾을 수 없습니다.", policyId });
        return jsonContent(policy);
      } catch (e) {
        return errorContent(e.message);
      }
    }
  );
}
