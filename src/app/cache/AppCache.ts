import { AppUtil } from "@/utils/AppUtil";

export enum CacheScreen {
  DASHBOARD = "DASHBOARD",
  CATEGORIES = "CATEGORIES",
}

export class AppCache {
  private static cache = new Map<string, any>();

  static has(screen: CacheScreen, userId: string): boolean {
    if (process.env.NODE_ENV === "development") {
      return false;
    }

    const key = AppUtil.generateKey(screen, userId);
    return AppCache.cache.has(key);
  }

  static get(screen: CacheScreen, userId: string): any | undefined {
    const key = AppUtil.generateKey(screen, userId);
    return AppCache.cache.get(key);
  }

  static set(screen: CacheScreen, userId: string, value: any): void {
    const key = AppUtil.generateKey(screen, userId);
    AppCache.cache.set(key, value);
  }

  static invalidate(screen: CacheScreen, userId: string): void {
    const key = AppUtil.generateKey(screen, userId);
    AppCache.cache.delete(key);
  }
}
