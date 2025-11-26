import { AppConstants } from "@/common/AppConstants";
import clientPromise from "@/lib/mongodb";

export const getCategories = async () => {
  try {
    const client = await clientPromise;
    const db = client.db(); // default DB from connection string
    const collection = db.collection(AppConstants.COLLECTION.CATEGORIES);
    const categories = await collection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return categories;
  } catch (error) {
    throw new Error(AppConstants.DB_ERROR);
  }
};
