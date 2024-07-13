import fs from 'fs';
import path, { dirname } from 'path';
import csvParser from 'csv-parser';
import cloudinary from '../utils/cloudinary';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Convert `import.meta.url` to `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local file
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

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

async function updateImageMetadata() {
  try {
    // Read the CSV metadata
    const metadataMap = await readCSVMetadata(path.join(__dirname, '../phil_course.csv'));

    // Ensure the data directory exists
    const dataDirectory = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, { recursive: true });
    }

    // Update metadata for each image in Cloudinary and save metadata to JSON files
    for (const [public_id, { title, description }] of metadataMap.entries()) {
      const updateResult = await cloudinary.uploader.explicit(public_id, {
        type: 'upload',
        context: `caption=${title}|alt=${description}`
      });
      console.log(`Updated metadata for image: ${public_id}`, updateResult);

      // Save metadata to a JSON file
      const metadataPath = path.join(dataDirectory, `${public_id}.json`);
      fs.writeFileSync(metadataPath, JSON.stringify({ title, description }, null, 2));
      console.log(`Saved metadata: ${metadataPath}`);
    }

    console.log('All images metadata have been updated in Cloudinary and saved to JSON files.');
  } catch (error) {
    console.error('Error updating images metadata:', error);
  }
}

updateImageMetadata();
