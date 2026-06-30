import { registerGetTime } from "./getTime.js";
import { registerPolicySearch } from "./policySearch.js";
import { registerPolicyDetail } from "./policyDetail.js";
import { registerPolicyRegion } from "./policyRegion.js";
import { registerPolicyCategory } from "./policyCategory.js";
import { registerPolicyRecommend } from "./policyRecommend.js";

export function registerTools(server) {
  registerGetTime(server);
  registerPolicySearch(server);
  registerPolicyDetail(server);
  registerPolicyRegion(server);
  registerPolicyCategory(server);
  registerPolicyRecommend(server);
}
