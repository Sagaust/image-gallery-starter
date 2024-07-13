import fs from 'fs';
import path, { dirname, join } from 'path';
import { MongoClient, MongoClientOptions } from 'mongodb';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import cloudinary from '../utils/cloudinary';
import dotenv from 'dotenv';
import csvParser from 'csv-parser';

// Convert `import.meta.url` to `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local file
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const saveDirectory = path.join(__dirname, '../public/images/phil_course');

const mongoUri = process.env.MONGODB_URI as string;
const mongoOptions: MongoClientOptions = {
  tls: true, // Use `tls` instead of `ssl`
};

// Function to read CSV and return a map of metadata
async function readCSVMetadata(filePath: string): Promise<Map<string, { title: string, description: string }>> {
  return new Promise((resolve, reject) => {
    const metadataMap = new Map();
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        metadataMap.set(row.public_id, { title: row.title, description: row.description });
      })
      .on('end', () => {
        resolve(metadataMap);
      })
      .on('error', reject);
  });
}

async function fetchAndSaveImages() {
  const client = new MongoClient(mongoUri, mongoOptions);

  try {
    await client.connect();
    const database = client.db('image_gallery');
    const collection = database.collection('images');

    // Ensure the save directory exists
    if (!fs.existsSync(saveDirectory)) {
      fs.mkdirSync(saveDirectory, { recursive: true });
    }

    // Read the CSV metadata
    const metadataMap = await readCSVMetadata(path.join(__dirname, '../path/to/your/csv/file.csv'));

    // Fetch images from Cloudinary
    console.log('Fetching images from Cloudinary...');
    const response = await cloudinary.search
      .expression('folder:phil_course') // Specify the folder here
      .max_results(30)
      .execute();

    console.log('Cloudinary response:', response);

    const images = response.resources;

    if (!images.length) {
      console.log('No images found in the specified folder.');
      return;
    }

    // Save each image to the save directory and metadata to MongoDB and JSON file
    for (const image of images) {
      const imageUrl = image.url;
      const folderPath = join(saveDirectory, image.folder || 'default_folder');
      const imagePath = join(folderPath, `${image.public_id}.${image.format}`);

      // Ensure the folder structure exists
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // Fetch the image data
      console.log(`Fetching image data for ${imageUrl}`);
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.buffer();

      // Save the image data to the file
      fs.writeFileSync(imagePath, imageBuffer);
      console.log(`Saved image: ${imagePath}`);

      // Get title and description from metadata map
      const metadata = metadataMap.get(image.public_id) || { title: '', description: '' };

      // Save metadata to a JSON file
      const metadataPath = join(folderPath, `${image.public_id}.json`);
      fs.writeFileSync(metadataPath, JSON.stringify({ ...image, ...metadata }, null, 2));
      console.log(`Saved metadata: ${metadataPath}`);

      // Save metadata to MongoDB
      await collection.updateOne(
        { public_id: image.public_id },
        { $set: { ...image, ...metadata } },
        { upsert: true }
      );
      console.log(`Saved metadata to MongoDB for image: ${image.public_id}`);
    }

    console.log('All images and their metadata have been fetched, saved, and stored in MongoDB.');
  } catch (error) {
    console.error('Error fetching and saving images:', error);
  } finally {
    await client.close();
  }
}

fetchAndSaveImages();
