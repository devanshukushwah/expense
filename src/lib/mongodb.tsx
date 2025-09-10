import { MongoClient } from "mongodb";

const uri: string = process.env.MONGODB_URI || "";
if (!uri) {
  throw new Error("Please add MONGODB_URI to your .env file");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// In development, use a global cached connection to avoid creating multiple clients
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
