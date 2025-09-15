"use server";

import { AppConstants } from "@/common/AppConstants";
import { withAuth } from "@/lib/withAuth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Spend } from "@/collection/Spend.collection";
import type { NextRequest } from "next/server";
import { AppCache, CacheScreen } from "@/app/cache/AppCache";

export const GET = withAuth(
  async (
    request: NextRequest & { user: { _id: string } }
  ): Promise<Response> => {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<Spend>(AppConstants.COLLECTION.SPENDS);
    const categoryCollection = db.collection(
      AppConstants.COLLECTION.CATEGORIES
    );

    const user = request.user;

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || AppConstants.ASC;

    const filter = {
      createdBy: new ObjectId(user._id),
      isDeleted: { $ne: true },
    };

    const spends = await collection
      .find(filter)
      .sort({ [sortBy]: sortOrder != AppConstants.ASC ? -1 : 1 })
      .limit(limit)
      .skip(skip)
      .toArray();

    const count = await collection.countDocuments(filter);

    const categories = await categoryCollection.find({}).toArray();

    spends.forEach((spend) => {
      const category = categories.find((cat) => cat.catId === spend.catId);
      spend.cat = category ? category.title : "Unknown";
    });

    return new Response(
      JSON.stringify({ success: true, data: { spends, count } }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
);

export const POST = withAuth(
  async (
    request: NextRequest & { user: { _id: string } }
  ): Promise<Response> => {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<Spend>(AppConstants.COLLECTION.SPENDS);

    const data = (await request.json()) as {
      amt: string | number;
      catId: number;
      desc?: string;
    };
    const { amt, catId, desc } = data;
    const user = request.user;

    if (!amt || !catId) {
      return new Response(JSON.stringify({ error: "invalid data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newSpend: Spend = {
      amt: parseFloat(amt as string),
      catId,
      desc,
      createdBy: new ObjectId(user._id),
      createdAt: new Date(),
    };
    const result = await collection.insertOne(newSpend);

    newSpend._id = result.insertedId;

    AppCache.invalidate(CacheScreen.DASHBOARD, request.user._id);

    return new Response(
      JSON.stringify({
        success: true,
        data: { spend: newSpend },
        message: "Spend created successfully",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 201,
      }
    );
  }
);
