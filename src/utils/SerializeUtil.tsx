export default class SerializeUtil {
  // utils/serializeDoc.ts
  static serializeDoc<T>(doc: T): T {
    if (doc === null || doc === undefined) return doc;

    if (Array.isArray(doc)) {
      return doc.map(serializeDoc) as T;
    }

    if (typeof doc === "object") {
      const obj: any = {};
      for (const key in doc) {
        const value = (doc as any)[key];

        if (key === "_id" && typeof value === "object" && value.toString) {
          obj[key] = value.toString(); // convert ObjectId -> string
        } else if (value instanceof Date) {
          obj[key] = value.toISOString(); // convert Date -> string
        } else {
          obj[key] = SerializeUtil.serializeDoc(value); // recurse for nested objects/arrays
        }
      }
      return obj as T;
    }

    return doc;
  }

  static serializeDocs<T>(docs: T[]): T[] {
    return docs.map(SerializeUtil.serializeDoc);
  }
}
