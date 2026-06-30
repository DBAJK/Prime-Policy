import * as api from "../api/youthCenterApi.js";
import { withCache } from "./cacheService.js";
import { REGIONS, CATEGORIES } from "../utils/constants.js";

export async function searchPolicies(keyword, pageNum = 1) {
  const key = `search:${keyword}:${pageNum}`;
  return withCache(key, () => api.searchPolicies({ keyword, pageNum }));
}

export async function getPolicyDetail(policyId) {
  const key = `detail:${policyId}`;
  return withCache(key, () => api.getPolicyDetail(policyId));
}

export async function getPoliciesByRegion(regionName, pageNum = 1) {
  const zipCd = REGIONS[regionName];
  if (!zipCd) {
    throw new Error(`알 수 없는 지역: ${regionName}. 가능한 지역: ${Object.keys(REGIONS).join(", ")}`);
  }
  const key = `region:${zipCd}:${pageNum}`;
  return withCache(key, () => api.getPoliciesByRegion({ zipCd, pageNum }));
}

export async function getPoliciesByCategory(categoryName, pageNum = 1) {
  const lclsfNm = CATEGORIES[categoryName];
  if (!lclsfNm) {
    throw new Error(`알 수 없는 분야: ${categoryName}. 가능한 분야: ${Object.keys(CATEGORIES).join(", ")}`);
  }
  const key = `category:${lclsfNm}:${pageNum}`;
  return withCache(key, () => api.getPoliciesByCategory({ lclsfNm, pageNum }));
}

export async function recommendPolicies({ age, region, employment }) {
  // 지역이 있으면 지역 기준, 없으면 취업상태 키워드 기준으로 후보를 수집한다.
  const base = region
    ? await getPoliciesByRegion(region).catch(() => ({ items: [] }))
    : await searchPolicies(employment || "청년").catch(() => ({ items: [] }));

  // 나이 조건으로 필터링한다(연령 제한이 없는 정책은 포함).
  const matched = base.items.filter((p) => {
    if (!p.ageLimit) return true;
    const min = Number(p.minAge) || 0;
    const max = Number(p.maxAge) || 999;
    return age >= min && age <= max;
  });

  return { total: matched.length, items: matched };
}
