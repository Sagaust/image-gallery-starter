// utils/mongodb.ts 
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || ''; // Your MongoDB URI

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let cachedClient: MongoClient | null = null;

export default async function connectToDatabase(): Promise<MongoClient> {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = await MongoClient.connect(uri, options);

    // Optional: Test the connection
    // await client.db("admin").command({ ping: 1 });

    cachedClient = client;
    return client;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error; // Rethrow the error for handling in the calling function
  }
}
