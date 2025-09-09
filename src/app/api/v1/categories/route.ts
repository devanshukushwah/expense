import { AppConstants } from "@/common/AppConstants";
import { responseOkWithData } from "@/lib/ResponseEntity";
import { withAuth } from "@/lib/withAuth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Spend } from "@/collection/Spend.collection";

export const GET = withAuth(async (request) => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.COLLECTION.CATEGORIES);

  const user = request.user;

  const categories = await collection.find().sort({ createdAt: -1 }).toArray();

  return new Response(JSON.stringify({ success: true, data: { categories } }), {
    headers: { "Content-Type": "application/json" },
  });
});
