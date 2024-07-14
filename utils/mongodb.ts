import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

async function connectToDatabase() {
  try {
    // Check if the client is connected by attempting a command
    await client.db().command({ ping: 1 });
    console.log('Connected to MongoDB'); // Optional logging
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    await client.connect(); // Attempt connection if not connected
    console.log('Connected to MongoDB (after initial failure)'); // Optional logging
  }
  
  const db = client.db(process.env.MONGODB_DB);
  return { db, client };
}

export default connectToDatabase;
