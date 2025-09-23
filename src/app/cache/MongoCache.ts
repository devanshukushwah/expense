"use server";

import { Cache } from "@/collection/Cache.collection";
import { AppConstants } from "@/common/AppConstants";
import clientPromise from "@/lib/mongodb";
import CacheScreen from "./CacheScreen";

export async function MongoCacheGet(
  screen: CacheScreen,
  userId: string,
  key?: string
): Promise<any> {
  const client = await clientPromise;
  const db = client.db();
  const cacheCollection = db.collection<Cache>(AppConstants.COLLECTION.CACHE);
  const value = await cacheCollection.findOne(
    { screen, userId, key },
    { projection: { _id: 0, value: 1 } }
  );
  return value?.value;
}

export async function MongoCacheSet(
  screen: CacheScreen,
  userId: string,
  key: string | undefined,
  value: any
): Promise<void> {
  const client = await clientPromise;
  const db = client.db();
  const cacheCollection = db.collection<Cache>(AppConstants.COLLECTION.CACHE);
  await cacheCollection.replaceOne(
    { screen, userId, key },
    { screen, userId, key, value, updatedAt: new Date() },
    {
      upsert: true,
    }
  );
}

export async function MongoCacheInvalidate(
  screen: CacheScreen,
  userId: string
): Promise<void> {
  const client = await clientPromise;
  const db = client.db();
  const cacheCollection = db.collection<Cache>(AppConstants.COLLECTION.CACHE);
  await cacheCollection.deleteMany({ screen, userId });
}
