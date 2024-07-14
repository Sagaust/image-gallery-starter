import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI); // Remove options

async function connectToDatabase() {
  if (!client.isConnected()) await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  return { db, client };
}

export default connectToDatabase;
