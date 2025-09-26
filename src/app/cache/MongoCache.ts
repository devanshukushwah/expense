"use server";

import { Cache } from "@/collection/Cache.collection";
import { AppConstants } from "@/common/AppConstants";
import clientPromise from "@/lib/mongodb";
import CacheScreen from "./CacheScreen";
import CryptoJs from "@/utils/CryptoJs";

export async function MongoCacheGet(
  screen: CacheScreen,
  userId: string,
  key?: string
): Promise<any> {
  const hashKey = CryptoJs.hashSHA256(key);
  const client = await clientPromise;
  const db = client.db();
  const cacheCollection = db.collection<Cache>(AppConstants.COLLECTION.CACHE);
  const value = await cacheCollection.findOne(
    { screen, userId, key: hashKey },
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
  const hashKey = CryptoJs.hashSHA256(key);
  const client = await clientPromise;
  const db = client.db();
  const cacheCollection = db.collection<Cache>(AppConstants.COLLECTION.CACHE);
  await cacheCollection.replaceOne(
    { screen, userId, key: hashKey },
    { screen, userId, key: hashKey, value, updatedAt: new Date() },
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
