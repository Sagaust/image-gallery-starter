// pages/index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";
import type { ImageProps } from "../utils/types";
import connectToDatabase from '../utils/mongodb'; // Import connectToDatabase
import getResults from '../utils/getResults';

const Home: React.FC<{ initialImages: ImageProps[] }> = ({ initialImages }) => {
  const [images, setImages] = useState<ImageProps[]>(initialImages);
  const router = useRouter();
  const { folder, photoId } = router.query;
  const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const folderName = folder || process.env.NEXT_PUBLIC_DEFAULT_FOLDER;
      if (folderName && folderName !== process.env.NEXT_PUBLIC_DEFAULT_FOLDER) {
        try {
          const res = await fetch(`/api/images?folder=${folderName}`);
          const data = await res.json();
          setImages(data.images);
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      }
    };

    fetchImages();
  }, [folder]);

  useEffect(() => {
    if (photoId) {
      const image = images.find((img) => img.id === Number(photoId));
      setSelectedImage(image || null);
    }
  }, [photoId, images]);

  return (
    <>
      <Gallery images={images} />
      <Footer />
    </>
  );
};

export async function getStaticProps() {
  const folder = process.env.NEXT_PUBLIC_DEFAULT_FOLDER || "default";

  try {
    // Fetch images directly from Cloudinary
    const results = await getResults();

    const images = results.resources.map((resource: any, index: number) => ({
      id: index,
      public_id: resource.public_id,
      format: resource.format,
      width: resource.width,
      height: resource.height,
      blurDataUrl: resource.blurDataUrl || '',
    }));

    // Fetch metadata from MongoDB
    const client = await connectToDatabase(); // Use connectToDatabase()
    const db = client.db();
    const metadataCollection = db.collection('image_metadata');
    const metadata = await metadataCollection.find({}).toArray();

    // Merge metadata with images
    const imagesWithMetadata = images.map((image: ImageProps) => {
      const meta = metadata.find((m: any) => m.public_id === image.public_id);
      return {
        ...image,
        title: meta?.title || '',
        description: meta?.description || '',
      };
    });

    return {
      props: {
        initialImages: imagesWithMetadata,
      },
      revalidate: 60, // Optional: Revalidate every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching images in getStaticProps:', error);
    return {
      props: {
        initialImages: [],
      },
    };
  }
}

export default Home;
