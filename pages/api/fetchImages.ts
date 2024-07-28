import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '../../utils/cloudinary';
import connectToDatabase from '../../utils/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { folder } = req.query;
  if (!folder) {
    res.status(400).json({ error: 'Folder is required' });
    return;
  }

  // Corrected database connection
  const client = await connectToDatabase();
  const db = client.db(); // Get the database instance
  const collection = db.collection('image_metadata');

  let nextCursor: string | null = null;

  try {
    do {
      const result = await cloudinary.search
        .expression(`folder:${folder}/*`)
        .with_field('context')
        .sort_by('public_id', 'desc')
        .max_results(500)
        .next_cursor(nextCursor)
        .execute();

      const formattedImages = result.resources.map(image => ({
        public_id: image.public_id,
        folder: folder,
        caption: image.context?.custom?.caption || '',
        description: image.context?.custom?.description || '',
        details: image.context?.custom?.details || '',
      }));

      if (formattedImages.length > 0) {
        // ... (insert into MongoDB)
        try {
          await collection.insertMany(formattedImages, { ordered: false });
        } catch (insertError) {
          // Specific error handling for MongoDB insertion
          console.error('Error inserting images into MongoDB:', insertError); 
        }
      }

      nextCursor = result.next_cursor;
    } while (nextCursor); 

    res.status(200).json({ message: 'Images fetched and stored successfully' });
  } catch (error) {
    // ... (general error handling)
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Error fetching images' }); 
  } finally {
    // Ensure client connection is closed after operations
    client.close();
  }
}
