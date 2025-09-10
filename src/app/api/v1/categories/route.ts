"use server";

import { AppConstants } from "@/common/AppConstants";
import { withAuth } from "@/lib/withAuth";
import clientPromise from "@/lib/mongodb";

export const GET = withAuth(async () => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.COLLECTION.CATEGORIES);

  const categories = await collection.find().sort({ createdAt: -1 }).toArray();

  return new Response(JSON.stringify({ success: true, data: { categories } }), {
    headers: { "Content-Type": "application/json" },
  });
});
