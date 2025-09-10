"use server";

import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async () => {
  return new Response(
    JSON.stringify({ success: true, message: "valid token" }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    }
  );
});
