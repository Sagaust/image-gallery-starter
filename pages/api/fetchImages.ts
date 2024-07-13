import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '../../utils/cloudinary';
import connectToDatabase from '../../utils/mongodb';

export default async function handler(req, res) {
  const { folder } = req.query;
  if (!folder) {
    res.status(400).json({ error: 'Folder is required' });
    return;
  }

  const { db } = await connectToDatabase();
  const collection = db.collection('image_metadata');

  let next_cursor = null;

  try {
    do {
      const options = {
        expression: `folder:${folder}/*`,
        with_field: 'context',
        sort_by: 'public_id',
        direction: 'desc',
        max_results: 500,
      };
      if (next_cursor) {
        options.next_cursor = next_cursor;
      }
      const result = await cloudinary.search.execute(options);

      const formattedImages = result.resources.map(image => ({
        public_id: image.public_id,
        folder: folder,
        caption: image.context?.custom?.caption || '',
        description: image.context?.custom?.description || '',
        details: image.context?.custom?.details || '',
      }));

      if (formattedImages.length > 0) {
        await collection.insertMany(formattedImages, { ordered: false });
      }

      next_cursor = result.next_cursor;
    } while (next_cursor);

    res.status(200).json({ message: 'Images fetched and stored successfully' });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      console.warn('Duplicate key error:', error.message);
    } else {
      console.error('Error fetching images from Cloudinary or storing in MongoDB:', error);
      res.status(500).json({ error: 'Error fetching images from Cloudinary or storing in MongoDB' });
    }
  }
}
