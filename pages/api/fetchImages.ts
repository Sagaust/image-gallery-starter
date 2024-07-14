import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '../../utils/cloudinary';
import connectToDatabase from '../../utils/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { folder } = req.query;
  if (!folder) {
    res.status(400).json({ error: 'Folder is required' });
    return;
  }

  const { db } = await connectToDatabase();
  const collection = db.collection('image_metadata');

  let nextCursor: string | null = null; // Use correct type for next_cursor

  try {
    do {
      const result = await cloudinary.search
        .expression(`folder:${folder}/*`)
        .with_field('context')
        .sort_by('public_id', 'desc')
        .max_results(500)
        .next_cursor(nextCursor) // Use the method for setting next_cursor
        .execute();

      const formattedImages = result.resources.map(image => ({
        public_id: image.public_id,
        folder: folder,
        caption: image.context?.custom?.caption || '',
        description: image.context?.custom?.description || '',
        details: image.context?.custom?.details || '',
      }));

      if (formattedImages.length > 0) {
        // ... (insert into MongoDB, handle errors)
        await collection.insertMany(formattedImages, { ordered: false });
      }
      nextCursor = result.next_cursor; 
    } while (nextCursor); // Use the new variable name

    res.status(200).json({ message: 'Images fetched and stored successfully' });
  } catch (error) {
    // ... (error handling)
    if (error.code === 11000) {
      // Duplicate key error
      console.warn('Duplicate key error:', error.message);
    } else {
      console.error('Error fetching images from Cloudinary or storing in MongoDB:', error);
      res.status(500).json({ error: 'Error fetching images from Cloudinary or storing in MongoDB' });
    }
  }
}
