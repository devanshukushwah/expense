"use server";

import { AppConstants } from "@/common/AppConstants";
import { withAuth } from "@/lib/withAuth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Spend } from "@/collection/Spend.collection";
import type { NextRequest } from "next/server";

export const GET = withAuth(
  async (
    request: NextRequest & { user: { _id: string } }
  ): Promise<Response> => {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<Spend>(AppConstants.COLLECTION.SPENDS);

    const user = request.user;

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = parseInt(searchParams.get("skip") || "0", 10);

    const spends = await collection
      .find({
        createdBy: new ObjectId(user._id),
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray();

    return new Response(JSON.stringify({ spends }), {
      headers: { "Content-Type": "application/json" },
    });
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
