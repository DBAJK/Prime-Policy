import axios from "axios";
import { config } from "../config.js";
import { parseXml } from "../utils/xmlParser.js";
import { PAGE_UNIT } from "../utils/constants.js";

const client = axios.create({
  baseURL: config.youthApiBaseUrl,
  timeout: 10000,
});

async function get(path, params) {
  const { data } = await client.get(path, {
    params: { openApiVlak: config.youthApiKey, pageUnit: PAGE_UNIT, ...params },
  });
  return parseXml(data);
}

export async function searchPolicies({ keyword = "", pageIndex = 1 } = {}) {
  const xml = await get("/empList.do", { keyword, pageIndex });
  const root = xml?.youthPolicyList;
  const items = root?.youthPolicy;
  if (!items) return [];
  return (Array.isArray(items) ? items : [items]).map(normalizeItem);
}

export async function getPolicyDetail(policyId) {
  const xml = await get("/empInfo.do", { srchPolicyId: policyId });
  const item = xml?.youthPolicyInfo?.youthPolicy;
  return item ? normalizeItem(item) : null;
}

export async function getPoliciesByRegion({ region, pageIndex = 1 } = {}) {
  const xml = await get("/empList.do", { srchPolyRgnl: region, pageIndex });
  const root = xml?.youthPolicyList;
  const items = root?.youthPolicy;
  if (!items) return [];
  return (Array.isArray(items) ? items : [items]).map(normalizeItem);
}

export async function getPoliciesByCategory({ category, pageIndex = 1 } = {}) {
  const xml = await get("/empList.do", { srchPolyBizSecd: category, pageIndex });
  const root = xml?.youthPolicyList;
  const items = root?.youthPolicy;
  if (!items) return [];
  return (Array.isArray(items) ? items : [items]).map(normalizeItem);
}

function normalizeItem(item) {
  return {
    id: item.bizId || "",
    title: item.polyBizSjnm || "",
    category: item.polyBizSecd || "",
    region: item.polyRgnl || "",
    operator: item.polyBizOvrvw || "",
    target: item.ageInfo || "",
    period: item.rqutPrdInfo || "",
    detail: item.polyItcnCn || "",
    url: item.rfcSiteUrls01 || item.rfcSiteUrls02 || "",
  };
}
