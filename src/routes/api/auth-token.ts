// routes/hello.ts

import { createFileRoute } from "@tanstack/react-router";
import { env } from "@/env";
import { fetchAuthToken } from "@/lib/auth";

export const Route = createFileRoute("/api/auth-token")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestData = await request.json();

        if (requestData.secret !== env.AUTH_TOKEN_API_SECRET) {
          return new Response("Unauthorized", { status: 401 });
        }

        const authToken = await fetchAuthToken();

        return new Response(JSON.stringify({ token: authToken }));
      },
    },
  },
});
