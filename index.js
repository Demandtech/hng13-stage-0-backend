import http from "http";

const rateLimitMap = new Map();

const PORT = process.env.PORT || 3000;
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 5;

const server = http.createServer(async (req, res) => {
  const start = Date.now();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const ip = req.socket.remoteAddress || "unknown";
  const currentTime = Date.now();

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, startTime: currentTime });
  } else {
    const entry = rateLimitMap.get(ip);
    if (currentTime - entry.startTime < RATE_LIMIT_WINDOW) {
      entry.count++;
      if (entry.count > MAX_REQUESTS) {
        res.writeHead(429, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Too many requests. Please try again later.",
          })
        );

        logRequest(req, 429, start);
        return;
      }
    } else {
      rateLimitMap.set(ip, { count: 1, startTime: currentTime });
    }
  }

  if( req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Welcome to Rasheed Adekunle's stage 0 task",
        routes: {
          "/me": "GET - Get user information along with a random cat fact",
        },
      })
    );
    logRequest(req, 200, start);
  }
  else if (req.url === "/me" && req.method === "GET") {
    try {
      const response = await fetch("https://catfact.ninja/fact");
      const data = await response.json();

      if (!data?.fact) throw new Error("Invalid data from catfact.ninja");

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "success",
          user: {
            email: "rasheedadekunle91@gmail.com",
            name: "Rasheed Adekunle",
            stack: "Expressjs/Node.js",
          },
          timestamp: new Date().toISOString(),
          fact: data.fact,
        })
      );

      logRequest(req, 200, start);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Error fetching users",
          error: error.message,
        })
      );
      logRequest(req, 500, start);
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end(
      JSON.stringify({
        message: req.url + " not found",
        error: "Route does not exist",
      })
    );
    logRequest(req, 404, start);
  }
});

function logRequest(req, statusCode, startTime) {
  const duration = Date.now() - startTime;
  const method = req.method.padEnd(6); // align column width
  const statusColor = getStatusColor(statusCode);

  console.log(
    `${method} ${
      req.url
    } - ${new Date().toISOString()} → ${statusColor}${statusCode}\x1b[0m (${duration}ms)`
  );
}

function getStatusColor(status) {
  if (status >= 500) return "\x1b[31m";
  if (status >= 400) return "\x1b[33m";
  if (status >= 300) return "\x1b[36m";
  if (status >= 200) return "\x1b[32m";
  return "\x1b[0m";
}

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
