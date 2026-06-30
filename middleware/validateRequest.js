export function validateMcpRequest(req, res, next) {
  const accept = req.headers["accept"] || "";
  if (!accept.includes("application/json") && !accept.includes("text/event-stream")) {
    return res.status(400).json({
      error: "Accept header must include application/json or text/event-stream",
    });
  }
  next();
}
