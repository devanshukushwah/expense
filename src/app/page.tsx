import { AppConstants } from "@/common/AppConstants";

import clientPromise from "@/lib/mongodb";
import Home from "../pages/Home";
import SerializeUtil from "@/utils/SerializeUtil";

export default async function Page() {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.COLLECTION.CATEGORIES);
  const categories = await collection.find().sort({ createdAt: -1 }).toArray();

  const serializeCategories = SerializeUtil.serializeDocs(categories);

  return <Home categories={serializeCategories} />;
}
