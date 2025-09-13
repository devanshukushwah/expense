"use server";

import { AppConstants } from "@/common/AppConstants";
import { withAuth } from "@/lib/withAuth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Category } from "@/collection/Category.collection";
import { AppCache, CacheScreen } from "@/app/cache/AppCache";
import { AppUtil } from "@/utils/AppUtil";

export const GET = withAuth(async (request) => {
  const client = await clientPromise;
  const db = client.db();
  const spendCollection = db.collection(AppConstants.COLLECTION.SPENDS);
  const categoryCollection = db.collection<Category>(
    AppConstants.COLLECTION.CATEGORIES
  );

  // Get current date
  const now = new Date();

  // Start of current month
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);

  // End of current month
  const endDate = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  if (AppCache.has(CacheScreen.DASHBOARD, request.user._id)) {
    const dashboard = AppCache.get(CacheScreen.DASHBOARD, request.user._id);
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          dashboard,
        },
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const dashboardArray = await spendCollection
    .aggregate([
      {
        $match: {
          amt: { $gt: 0 },
          createdBy: new ObjectId(request.user._id),
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$catId",
          totalAmt: { $sum: "$amt" },
        },
      },
      {
        $group: {
          _id: null,
          categories: {
            $push: {
              catId: "$_id",
              amt: "$totalAmt",
            },
          },
          totalSpends: { $sum: "$totalAmt" },
        },
      },
    ])
    .toArray();

  const dashboard = dashboardArray[0];

  if (dashboard?.categories?.length) {
    const categories = await categoryCollection.find({}).toArray();

    dashboard.categories = dashboard.categories.map((cat) => {
      const category = categories.find((c) => c.catId === cat.catId);
      return {
        ...cat,
        title: category ? category.title : AppConstants.UNKNOWN,
      };
    });
  }

  AppCache.set(CacheScreen.DASHBOARD, request.user._id, dashboard);

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        dashboard,
      },
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
});

// const data = {
//   totalSpends: 0,
//   categories: [
//     { catId: 1, amt: 0 },
//     { catId: 2, amt: 0 },
//     { catId: 3, amt: 0 },
//     { catId: 4, amt: 0 },
//     { catId: 5, amt: 0 },
//   ],
// };
