export function textContent(text) {
  return { content: [{ type: "text", text: String(text) }] };
}

export function jsonContent(obj) {
  return { content: [{ type: "text", text: JSON.stringify(obj, null, 2) }] };
}

export function errorContent(message) {
  return { content: [{ type: "text", text: `오류: ${message}` }], isError: true };
}
