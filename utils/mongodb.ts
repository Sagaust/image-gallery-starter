import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

async function connectToDatabase() {
  try {
    // Check if client is already connected
    if (!client.topology || !client.topology.isConnected()) { 
      // If not, try to establish a connection
      await client.connect(); 
    }
    
    const db = client.db(process.env.MONGODB_DB);
    return { db, client };
  } catch (err) {
    // Handle connection error
    console.error('Failed to connect to MongoDB:', err);
    throw err; // Rethrow the error or handle it gracefully
  }
}

export default connectToDatabase;
