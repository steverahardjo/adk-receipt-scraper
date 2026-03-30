import { auth } from "./auth";

const server = Bun.serve({
  port: 3000,

  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname.startsWith("/api/auth")) {
      return auth.handler(req);
    }

    return new Response("Auth server running");
  },
});

console.log(`Auth server running on http://localhost:${server.port}`);
