"use server";

import { AppConstants } from "@/common/AppConstants";
import { withAuth } from "@/lib/withAuth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Spend } from "@/collection/Spend.collection";
import { AppCache, CacheScreen } from "@/app/cache/AppCache";

export const PUT = withAuth(async (request, { params }): Promise<Response> => {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<Spend>(AppConstants.COLLECTION.SPENDS);
  const data = (await request.json()) as {
    amt?: string | number;
    catId?: number;
    desc?: string;
  };

  const { spendId } = await params;
  const { amt, catId, desc } = data;
  const user = request.user;

  if (!spendId) {
    return new Response(JSON.stringify({ error: "invalid data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const spend = await collection.findOne({
    _id: new ObjectId(spendId),
    createdBy: new ObjectId(user._id),
  });

  if (!spend) {
    return new Response(JSON.stringify({ error: "Spend not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const updatedSpend: Partial<Spend> = {
    updatedAt: new Date(),
  };

  if (amt !== undefined) updatedSpend.amt = parseFloat(amt as string);
  if (catId !== undefined) updatedSpend.catId = catId;
  if (desc !== undefined) updatedSpend.desc = desc;
  await collection.updateOne(
    { _id: new ObjectId(spendId) },
    { $set: updatedSpend }
  );

  AppCache.invalidate(CacheScreen.DASHBOARD, request.user._id);

  return new Response(
    JSON.stringify({
      success: true,
      data: { spend: { ...spend, ...updatedSpend, _id: spend._id } },
      message: "Spend updated successfully",
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    }
  );
});

export const GET = withAuth(async (request, { params }) => {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<Spend>(AppConstants.COLLECTION.SPENDS);

  const user = request.user;
  const { spendId } = await params;

  const spend = await collection.findOne({
    _id: new ObjectId(spendId),
    createdBy: new ObjectId(user._id),
  });

  if (!spend) {
    return new Response(JSON.stringify({ error: "Spend not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true, data: { spend } }), {
    headers: { "Content-Type": "application/json" },
  });
});

export const DELETE = withAuth(async (request, { params }) => {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<Spend>(AppConstants.COLLECTION.SPENDS);

  const user = request.user;
  const { spendId } = await params;

  const response = await collection.updateOne(
    {
      _id: new ObjectId(spendId),
      createdBy: new ObjectId(user._id),
    },
    { $set: { isDeleted: true } }
  );

  if (!response) {
    return new Response(JSON.stringify({ error: "Failed to delete" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ success: true, message: "Spend deleted successfully" }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
});
