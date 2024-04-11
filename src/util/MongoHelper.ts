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

/**
 * Server-Side Database Utilities.
 */
const Database = {
    /**
     * Returns a promise that is resolved when the connection to the database succeeds. 
     * If another call is made to `connect()`, it returns the first promise. Thus it only
     * maintains one connection per server.
     * 
     * @throws {DatabaseDown} Thrown when the connection to the database fails.
     * 
     * @returns A cached promise that is resolved when either the connection to the database succeeds. The promise
     * is rejected with a DatabaseDown response if the connection fails. 
     */
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
                throw new DatabaseDown();
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