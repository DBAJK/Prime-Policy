import axios from "axios";
import { config } from "../config.js";
import { PAGE_SIZE } from "../utils/constants.js";

// 온통청년 신버전 OpenAPI (JSON)
//   GET https://www.youthcenter.go.kr/go/ythip/getPlcy
//   인증 파라미터: apiKeyNm
const client = axios.create({
  baseURL: config.youthApiBaseUrl,
  timeout: 10000,
});

async function fetchPolicies(params) {
  if (!config.youthApiKey) {
    throw new Error("YOUTH_API_KEY 환경변수가 설정되지 않았습니다.");
  }

  const { data } = await client.get("/getPlcy", {
    params: {
      apiKeyNm: config.youthApiKey,
      pageType: 1,
      pageNum: 1,
      pageSize: PAGE_SIZE,
      ...params,
    },
  });

  if (data?.resultCode !== 200) {
    throw new Error(`API 오류: ${data?.resultMessage || "알 수 없는 오류"}`);
  }

  const list = data?.result?.youthPolicyList || [];
  const total = data?.result?.pagging?.totCount ?? list.length;
  return { total, items: list.map(normalizeItem) };
}

export async function searchPolicies({ keyword = "", pageNum = 1 } = {}) {
  // plcyNm(정책명)은 자유 검색어와 부분일치하므로 키워드 검색에 적합하다.
  return fetchPolicies({ plcyNm: keyword, pageNum });
}

export async function getPolicyDetail(policyId) {
  const { items } = await fetchPolicies({ plcyNo: policyId, pageType: 2, pageSize: 1 });
  return items[0] || null;
}

export async function getPoliciesByRegion({ zipCd, pageNum = 1 } = {}) {
  return fetchPolicies({ zipCd, pageNum });
}

export async function getPoliciesByCategory({ lclsfNm, pageNum = 1 } = {}) {
  return fetchPolicies({ lclsfNm, pageNum });
}

// 신버전 API 응답 필드를 내부 표준 형태로 변환한다.
function normalizeItem(item) {
  return {
    id: item.plcyNo || "",
    title: item.plcyNm || "",
    keyword: item.plcyKywdNm || "",
    category: item.lclsfNm || "",
    subCategory: item.mclsfNm || "",
    summary: (item.plcyExplnCn || "").trim(),
    support: (item.plcySprtCn || "").trim(),
    operator: item.operInstCdNm || item.sprvsnInstCdNm || "",
    minAge: item.sprtTrgtMinAge || "",
    maxAge: item.sprtTrgtMaxAge || "",
    ageLimit: item.sprtTrgtAgeLmtYn === "Y",
    applyPeriod: item.aplyYmd || item.bizPrdEtcCn || "",
    applyMethod: (item.plcyAplyMthdCn || "").trim(),
    documents: (item.sbmsnDcmntCn || "").trim(),
    applyUrl: item.aplyUrlAddr || "",
    refUrl: item.refUrlAddr1 || item.refUrlAddr2 || "",
  };
}
