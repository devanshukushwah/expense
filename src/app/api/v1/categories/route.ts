"use server";

import { AppConstants } from "@/common/AppConstants";
import { withAuth } from "@/lib/withAuth";
import clientPromise from "@/lib/mongodb";
import { AppCache } from "@/cache/AppCache";
import CacheScreen from "@/cache/CacheScreen";

export const GET = withAuth(async () => {
  if (AppCache.has(CacheScreen.CATEGORIES, AppConstants.NO_VALUE)) {
    const categories = AppCache.get(
      CacheScreen.CATEGORIES,
      AppConstants.NO_VALUE
    );

    return new Response(
      JSON.stringify({ success: true, data: { categories } }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.COLLECTION.CATEGORIES);

  const categories = await collection.find().sort({ createdAt: -1 }).toArray();

  AppCache.set(CacheScreen.CATEGORIES, AppConstants.NO_VALUE, categories);

  return new Response(JSON.stringify({ success: true, data: { categories } }), {
    headers: { "Content-Type": "application/json" },
  });
});
