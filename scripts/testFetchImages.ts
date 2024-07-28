import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb'; // Import ServerApiVersion
import cloudinary from '../utils/cloudinary';

// Resolve the current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Explicitly load .env.local configuration
dotenv.config({ path: join(__dirname, '../.env.local') });

console.log('Cloudinary Config:', {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

// Define the directory to save images
const saveDirectory = join(__dirname, '../public/images/phil_course');
const mongoUri = process.env.MONGODB_URI as string;

async function fetchAndSaveImages() {
  // Create a new MongoClient with the ServerApiVersion option
  const client = new MongoClient(mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    // Connect to the MongoDB client
    await client.connect();
    const database = client.db('image_gallery');
    const collection = database.collection('image_metadata');

    // Ensure the save directory exists
    if (!fs.existsSync(saveDirectory)) {
      fs.mkdirSync(saveDirectory, { recursive: true });
    }

    // Fetch images from Cloudinary
    const response = await cloudinary.search
      .expression('folder:phil_course') // Specify the folder here
      .max_results(100)
      .execute();

    const images = response.resources;

    // Save each image to the save directory and metadata to MongoDB
    for (const image of images) {
      const imageUrl = image.url;
      const imagePath = join(saveDirectory, `${image.public_id}.${image.format}`);

      // Fetch the image data
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.buffer();

      // Save the image data to the file
      fs.writeFileSync(imagePath, imageBuffer);
      console.log(`Saved image: ${imagePath}`);

      // Save metadata to a JSON file
      const metadataPath = join(saveDirectory, `${image.public_id}.json`);
      const metadata = {
        public_id: image.public_id,
        format: image.format,
        version: image.version,
        resource_type: image.resource_type,
        type: image.type,
        created_at: image.created_at,
        bytes: image.bytes,
        width: image.width,
        height: image.height,
        url: image.url,
        secure_url: image.secure_url,
        folder: 'phil_course', // Add folder information if needed
        title: image.context?.custom?.caption || '', // Include title from Cloudinary context
        description: image.context?.custom?.description || '', // Include description from Cloudinary context
      };

      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      console.log(`Saved metadata: ${metadataPath}`);

      // Save metadata to MongoDB
      await collection.updateOne(
        { public_id: image.public_id },
        { $set: metadata },
        { upsert: true }
      );
      console.log(`Saved metadata to MongoDB for image: ${image.public_id}`);
    }

    console.log('All images and their metadata have been fetched, saved, and stored in MongoDB.');
  } catch (error) {
    console.error('Error fetching and saving images:', error);
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}

fetchAndSaveImages();
