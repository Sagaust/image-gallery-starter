// pages/api/images.ts
import { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "../../utils/cloudinary";
import getBase64ImageUrl from "../../utils/generateBlurPlaceholder";
import type { ImageProps } from "../../utils/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { folder } = req.query;
    if (!folder || typeof folder !== 'string') {
      return res.status(400).json({ error: "Folder is required" });
    }

    const results = await cloudinary.search
      .expression(`folder:${folder}/*`)
      .sort_by("public_id", "desc")
      .max_results(400)
      .execute();

    const reducedResults: ImageProps[] = results.resources.map((result, i) => ({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
      title: result.context?.custom?.caption || "", // Fetch title (caption) from context
      description: result.context?.custom?.alt || "", // Fetch description (alt) from context
    }));

    const blurImagePromises = results.resources.map((image: ImageProps) => {
      return getBase64ImageUrl(image);
    });
    const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

    for (let i = 0; i < reducedResults.length; i++) {
      reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
    }

    return res.status(200).json({ images: reducedResults });
  } catch (error) {
    console.error('Error fetching images:', error);
    return res.status(500).json({ error: 'Error fetching images' });
  }
}
