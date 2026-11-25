import { createFileRoute } from "@tanstack/react-router";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

export const Route = createFileRoute("/api/rss")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const u = new URL(request.url).searchParams.get("u");
        let target: URL;
        try {
          target = new URL(u ?? "");
        } catch {
          return new Response("Bad request", { status: 400 });
        }
        if (target.protocol !== "https:" || target.hostname !== "news.google.com" || !target.pathname.startsWith("/rss")) {
          return new Response("Bad request", { status: 400 });
        }
        try {
          const r = await fetch(target.toString(), { headers: { "User-Agent": UA, Accept: "application/rss+xml, application/xml, text/xml, */*" } });
          if (!r.ok) return new Response("Upstream error", { status: 502 });
          const body = await r.text();
          return new Response(body, {
            headers: {
              "Content-Type": "application/xml",
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "public, max-age=300",
            },
          });
        } catch {
          return new Response("Upstream error", { status: 502 });
        }
      },
    },
  },
});
