import mongoose from "mongoose";
import DatabaseDown from "./responses/DatabaseDown";

declare global {
  var mongoose: any; // This must be a `var` and not a `let / const`
}

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const Database = {
    async connect() {
        if(cached.conn) return cached.conn;
        
        

        if (!cached.promise) {
            const opts = {
                bufferCommands: false,
            };
            cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
                return mongoose;
            }).catch((e) => {
                console.log(e);
            });
        }
        try {
            cached.conn = await cached.promise;
        } catch (e) {
            cached.promise = null;
            throw new DatabaseDown();
        }
    
        return cached.conn;
    }
}

export default Database;