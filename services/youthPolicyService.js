import * as api from "../api/youthCenterApi.js";
import { withCache } from "./cacheService.js";
import { REGIONS, CATEGORIES } from "../utils/constants.js";

export async function searchPolicies(keyword, pageIndex = 1) {
  const key = `search:${keyword}:${pageIndex}`;
  return withCache(key, () => api.searchPolicies({ keyword, pageIndex }));
}

export async function getPolicyDetail(policyId) {
  const key = `detail:${policyId}`;
  return withCache(key, () => api.getPolicyDetail(policyId));
}

export async function getPoliciesByRegion(regionName, pageIndex = 1) {
  const regionCode = REGIONS[regionName];
  if (!regionCode) throw new Error(`알 수 없는 지역: ${regionName}. 가능한 지역: ${Object.keys(REGIONS).join(", ")}`);
  const key = `region:${regionCode}:${pageIndex}`;
  return withCache(key, () => api.getPoliciesByRegion({ region: regionCode, pageIndex }));
}

export async function getPoliciesByCategory(categoryName, pageIndex = 1) {
  const categoryCode = CATEGORIES[categoryName];
  if (!categoryCode) throw new Error(`알 수 없는 분야: ${categoryName}. 가능한 분야: ${Object.keys(CATEGORIES).join(", ")}`);
  const key = `category:${categoryCode}:${pageIndex}`;
  return withCache(key, () => api.getPoliciesByCategory({ category: categoryCode, pageIndex }));
}

export async function recommendPolicies({ age, region, employment }) {
  const results = [];

  if (region) {
    const byRegion = await getPoliciesByRegion(region).catch(() => []);
    results.push(...byRegion);
  }

  const byKeyword = await searchPolicies(employment || "청년").catch(() => []);
  results.push(...byKeyword);

  // Deduplicate by id
  const seen = new Set();
  const unique = results.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  // Basic age filter: keep items that mention the age range or have no target info
  return unique.filter((p) => {
    if (!p.target || !age) return true;
    const t = p.target.replace(/\s/g, "");
    const nums = t.match(/\d+/g)?.map(Number) || [];
    if (nums.length >= 2) return age >= nums[0] && age <= nums[nums.length - 1];
    return true;
  });
}
