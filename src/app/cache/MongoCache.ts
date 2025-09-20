"use server";

import { Cache } from "@/collection/Cache.collection";
import { AppConstants } from "@/common/AppConstants";
import clientPromise from "@/lib/mongodb";
import { AppUtil } from "@/utils/AppUtil";
import CacheScreen from "./CacheScreen";

export async function MongoCacheGet(
  screen: CacheScreen,
  userId: string
): Promise<any> {
  const key = AppUtil.generateKey(screen, userId);
  const client = await clientPromise;
  const db = client.db();
  const cacheCollection = db.collection<Cache>(AppConstants.COLLECTION.CACHE);
  const value = await cacheCollection.findOne(
    { key },
    { projection: { _id: 0, value: 1 } }
  );
  return value?.value;
}

export async function MongoCacheSet(
  screen: CacheScreen,
  userId: string,
  value: any
): Promise<void> {
  const key = AppUtil.generateKey(screen, userId);
  const client = await clientPromise;
  const db = client.db();
  const cacheCollection = db.collection<Cache>(AppConstants.COLLECTION.CACHE);
  await cacheCollection.replaceOne(
    { key },
    { key, value },
    {
      upsert: true,
    }
  );
}

export async function MongoCacheInvalidate(
  screen: CacheScreen,
  userId: string
): Promise<void> {
  const key = AppUtil.generateKey(screen, userId);
  const client = await clientPromise;
  const db = client.db();
  const cacheCollection = db.collection<Cache>(AppConstants.COLLECTION.CACHE);
  await cacheCollection.deleteMany({ key });
}
