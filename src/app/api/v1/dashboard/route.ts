"use server";

import { AppConstants } from "@/common/AppConstants";
import { withAuth } from "@/lib/withAuth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Category } from "@/collection/Category.collection";
import { AppCache, CacheScreen } from "@/app/cache/AppCache";
import moment from "moment-timezone";
import DateUtil from "@/utils/DateUtil";

export const GET = withAuth(async (request) => {
  const { startDate, endDate } = DateUtil.getCurrentMonthStartEndDate();

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

  const client = await clientPromise;
  const db = client.db();
  const spendCollection = db.collection(AppConstants.COLLECTION.SPENDS);
  const categoryCollection = db.collection<Category>(
    AppConstants.COLLECTION.CATEGORIES
  );

  const dashboardArray = await spendCollection
    .aggregate([
      {
        $match: {
          amt: { $gt: 0 },
          isDeleted: { $ne: true },
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

  // Today Spends logic
  const { startDate: todayStartDate, endDate: todayEndDate } =
    DateUtil.getCurrentDayStartEndDate();

  const todaySpends = await spendCollection
    .aggregate([
      {
        $match: {
          amt: { $gt: 0 },
          isDeleted: { $ne: true },
          createdBy: new ObjectId(request.user._id),
          createdAt: {
            $gte: todayStartDate,
            $lte: todayEndDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          todaySpends: { $sum: "$amt" },
        },
      },
    ])
    .toArray();

  dashboard.todaySpends = todaySpends[0]?.todaySpends;

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
