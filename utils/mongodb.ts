// ../../utils/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || ''; // Make sure your URI is correctly set in the environment

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let cachedClient: MongoClient | null = null;

export default async function connectToDatabase(): Promise<MongoClient> {
  if (cachedClient) {
    return cachedClient; // Return the cached client if it exists
  }

  try {
    const client = await MongoClient.connect(uri, options);

    // The following line can be optional, depending on your connection needs:
    // await client.db("admin").command({ ping: 1 }); // Test the connection

    cachedClient = client; // Cache the connected client
    return client;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error; // Rethrow the error for handling in the calling function
  }
}
