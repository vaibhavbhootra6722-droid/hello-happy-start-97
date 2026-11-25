import { createFileRoute } from "@tanstack/react-router";
import html from "../static/index.html?raw";

// Serves the uploaded page exactly as provided, unmodified.
export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    },
  },
});
