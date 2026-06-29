const http = require("http");

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            status: "ok",
            message: "MCP Test Server",
            time: new Date().toISOString()
        }));
        return;
    }

    if (req.url === "/health") {
        res.writeHead(200);
        res.end("healthy");
        return;
    }

    res.writeHead(404);
    res.end("Not Found");
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
