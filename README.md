# Prime-Policy MCP Server

온통청년(YouthCenter) OpenAPI를 활용한 **PlayMCP** 등록용 Remote MCP 서버입니다.  
**Streamable HTTP** 전송 방식, **Stateless** 모드로 동작합니다.

- MCP Spec: 2025-03-26 이상
- Transport: Streamable HTTP (`POST /mcp`)
- Health: `GET /health`

## Tools (6개)

| Tool | 설명 | read-only | open-world | idempotent |
|------|------|:---------:|:----------:|:----------:|
| `get_time` | 서버 현재 시간 조회 | ✅ | ❌ | ❌ |
| `policy_search` | 키워드 기반 정책 검색 | ✅ | ✅ | ✅ |
| `policy_detail` | 정책 ID로 상세 조회 | ✅ | ✅ | ✅ |
| `policy_region` | 지역별 정책 조회 | ✅ | ✅ | ✅ |
| `policy_category` | 분야별 정책 조회 | ✅ | ✅ | ✅ |
| `policy_recommend` | 나이/지역/취업상태 기반 맞춤 추천 | ✅ | ✅ | ❌ |

## 프로젝트 구조

```
Prime-Policy/
├── Dockerfile
├── package.json
├── server.js              # Express 앱 진입점
├── mcpServer.js           # McpServer 팩토리
├── config.js              # 환경변수 설정
├── .env.example
│
├── routes/
│   ├── health.js          # GET /health
│   └── mcp.js             # POST /mcp (Streamable HTTP)
│
├── api/
│   └── youthCenterApi.js  # 온통청년 OpenAPI 클라이언트
│
├── services/
│   ├── youthPolicyService.js  # 비즈니스 로직
│   └── cacheService.js        # 메모리 캐시 (TTL 5분)
│
├── tools/
│   ├── index.js           # Tool 등록 진입점
│   ├── getTime.js
│   ├── policySearch.js
│   ├── policyDetail.js
│   ├── policyRegion.js
│   ├── policyCategory.js
│   └── policyRecommend.js
│
├── middleware/
│   ├── logger.js
│   ├── errorHandler.js
│   └── validateRequest.js
│
├── models/
│   ├── policyRequest.js   # Zod 입력 스키마
│   └── policyResponse.js  # Zod 출력 스키마
│
├── utils/
│   ├── xmlParser.js       # XML → JSON 변환
│   ├── response.js        # MCP 응답 헬퍼
│   └── constants.js       # 지역/분야 코드 상수
│
└── data/
    └── samplePolicy.json  # 샘플 데이터
```

## 환경변수 설정

```bash
cp .env.example .env
# .env 파일에 YOUTH_API_KEY 입력
```

```env
PORT=8080
YOUTH_API_KEY=발급받은_API_KEY
MCP_STATELESS=true
```

## 로컬 실행

```bash
npm install
npm start          # PORT 기본값 8080
```

## MCP Inspector 검증

```bash
npx @modelcontextprotocol/inspector
```

1. Transport: **Streamable HTTP**
2. URL: `http://localhost:8080/mcp`
3. Connect → `tools/list` → `tools/call`

## curl 스모크 테스트

```bash
# health
curl http://localhost:8080/health

# tools/list
curl -s http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'

# policy_search
curl -s http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"policy_search","arguments":{"keyword":"청년취업"}}}'

# policy_region
curl -s http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"policy_region","arguments":{"region":"서울"}}}'

# policy_recommend
curl -s http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"policy_recommend","arguments":{"age":28,"region":"경기","employment":"미취업"}}}'
```

## Docker

```bash
docker build -t prime-policy .
docker run -p 8080:8080 -e YOUTH_API_KEY=발급키 prime-policy
```

## PlayMCP 등록

1. GitHub HTTPS 저장소 연결: `https://github.com/DBAJK/Prime-Policy.git`
2. PlayMCP가 Kaniko로 Dockerfile 빌드
3. MCP 엔드포인트: `POST /mcp` (Streamable HTTP, Stateless)
