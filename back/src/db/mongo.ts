import { MongoClient, Database } from "mongo";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import{PeliculaSchema} from "./schemas.ts";
import { UserSchema } from "./schemas.ts";

await config({ export: true, allowEmptyValues: true });

const client = new MongoClient();


await client.connect({
  db: Deno.env.get('DB_NAME'),
  tls: true,
  servers: [
    {
      host: Deno.env.get('MONGO_URI'),
      port: parseInt(Deno.env.get("PORT")!),
    },
  ],
  credential: {
    username: Deno.env.get('MONGO_USR'),
    password: Deno.env.get('MONGO_PWD'),
    db: Deno.env.get('DB_NAME'),
    mechanism: "SCRAM-SHA-1",
  },
});

const db = client.database(Deno.env.get('DB_NAME'));
console.info("Mongodb connected");

console.info(`MongoDB ${db.name} connected`);
export const pelisCollection = db.collection<PeliculaSchema>("Pelicula");
export const usersCollection = db.collection<UserSchema>("Usuario")
