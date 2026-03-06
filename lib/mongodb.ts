import { MongoClient, Db, ServerApiVersion } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;

export function shouldSkipDatabase() {
  return process.env.SKIP_DB_DURING_BUILD === "1";
}

function buildClientPromise() {
  const client = new MongoClient(uri!, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  });

  return client.connect();
}

export function getMongoClientPromise() {
  if (!uri || shouldSkipDatabase()) {
    return undefined;
  }

  if (!global._mongoClientPromise) {
    global._mongoClientPromise = buildClientPromise();
  }

  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const mongoClientPromise = getMongoClientPromise();
  if (!mongoClientPromise) {
    throw new Error("Missing MONGODB_URI");
  }
  const connected = await mongoClientPromise;
  const dbName = process.env.MONGODB_DB ?? "porra";
  return connected.db(dbName);
}
