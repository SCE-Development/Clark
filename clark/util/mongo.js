import mongoose from 'mongoose';

let dbHost = 'sce-mongodb-dev';
const uri = `mongodb://127.0.0.1:27017/sce_core`;

export async function connectToDatabase() {
  try {
    const client = await mongoose.connect(uri);
    console.log("DB connected");
    return client.connection.db; 
  } catch {
    console.log("error connecting to mongo");
    throw error;
  }
}