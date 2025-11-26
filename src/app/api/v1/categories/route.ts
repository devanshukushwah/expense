"use server";

import { AppConstants } from "@/common/AppConstants";
import { withAuth } from "@/lib/withAuth";
import clientPromise from "@/lib/mongodb";
import { AppCache } from "@/cache/AppCache";
import CacheScreen from "@/cache/CacheScreen";
import * as categoriesDAO from "@/backend/repo/category.repo";

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

  const categories = await categoriesDAO.getCategories();

  AppCache.set(CacheScreen.CATEGORIES, AppConstants.NO_VALUE, categories);

  return new Response(JSON.stringify({ success: true, data: { categories } }), {
    headers: { "Content-Type": "application/json" },
  });
});
