"use server";

import { AppConstants } from "@/common/AppConstants";
import { withAuth } from "@/lib/withAuth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Category } from "@/collection/Category.collection";
import DateUtil from "@/utils/DateUtil";
import CacheScreen from "@/app/cache/CacheScreen";
import { MongoCacheGet, MongoCacheSet } from "@/app/cache/MongoCache";

export const GET = withAuth(async (request) => {
  const { startDate, endDate } = DateUtil.getCurrentMonthStartEndDate();

  const cacheValue = await MongoCacheGet(
    CacheScreen.DASHBOARD,
    request.user._id,
    undefined
  );

  if (cacheValue) {
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          dashboard: cacheValue,
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

  const filter = (startDate, endDate) => ({
    amt: { $gt: 0 },
    isDeleted: { $in: [false, null] },
    createdBy: new ObjectId(request.user._id),
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  const dashboardArray = await spendCollection
    .aggregate([
      {
        $match: filter(startDate, endDate),
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
        $match: filter(todayStartDate, todayEndDate),
      },
      {
        $group: {
          _id: null,
          todaySpends: { $sum: "$amt" },
        },
      },
    ])
    .toArray();

  dashboard.todaySpends = todaySpends[0]?.todaySpends || 0;

  await MongoCacheSet(
    CacheScreen.DASHBOARD,
    request.user._id,
    undefined,
    dashboard
  );

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
