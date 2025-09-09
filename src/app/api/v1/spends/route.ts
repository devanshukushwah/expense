import { AppConstants } from "@/common/AppConstants";
import { responseOkWithData } from "@/lib/ResponseEntity";
import { withAuth } from "@/lib/withAuth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const GET = withAuth(async (request) => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.COLLECTION.SPENDS);

  const user = request.user;

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit"), 10);
  const skip = parseInt(searchParams.get("skip"), 0);

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
});

export const POST = withAuth(async (request) => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.COLLECTION.SPENDS);

  const data = await request.json();
  const { amt, cat, desc } = data;
  const user = request.user;

  if (!amt || !cat) {
    return new Response(JSON.stringify({ error: "invalid data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let newSpend = {
    amt,
    cat,
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
});
