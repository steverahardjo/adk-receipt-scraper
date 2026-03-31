import { auth } from "./auth";
import { VerifyInternalJwt } from "./jwt";

const server = Bun.serve({
  port: 3000,

  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname == "/api/internal/verify" && req.method == "POST") {
      const body = await req.json();
      const token = body.token;
      try {
        const payload = await VerifyInternalJwt(token);
        return new Response(JSON.stringify(payload), { status: 200 });
      } catch (error) {
        return new Response(error.message, { status: 401 });
      }
    }

    if (url.pathname.startsWith("/api/auth")) {
      return auth.handler(req);
    }
    return new Response("Auth server running");
  },
});

console.log(`Auth server running on http://localhost:${server.port}`);
