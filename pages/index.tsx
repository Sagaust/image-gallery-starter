// pages/index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Gallery from "../components/Gallery";
import type { ImageProps } from "../utils/types";
import clientPromise from '../utils/mongodb'; // Assuming this is your MongoDB helper
import { MongoClient } from 'mongodb'; // Import MongoClient

const Home: React.FC<{ initialImages: ImageProps[] }> = ({ initialImages }) => {
  const [images, setImages] = useState<ImageProps[]>(initialImages);
  const router = useRouter();
  const { folder, photoId } = router.query;
  const [autoPlay, setAutoPlay] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null);

  const handlePreviousImage = () => {
    if (selectedImage) {
      const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
      const previousIndex = (currentIndex - 1 + images.length) % images.length;
      setSelectedImage(images[previousIndex]);
      router.push(`/?photoId=${images[previousIndex].id}`, undefined, { shallow: true });
    }
  };

  const handleNextImage = () => {
    if (selectedImage) {
      const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
      const nextIndex = (currentIndex + 1) % images.length;
      setSelectedImage(images[nextIndex]);
      router.push(`/?photoId=${images[nextIndex].id}`, undefined, { shallow: true });
    }
  };

  const handleToggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
  };

  useEffect(() => {
    const fetchImages = async () => {
      const folderName = folder || process.env.NEXT_PUBLIC_DEFAULT_FOLDER;
      if (folderName) {
        try {
          const res = await fetch(`/api/images?folder=${folderName}`);
          const data = await res.json();
          setImages(data.images);
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      }
    };

    if (folder) {
      fetchImages();
    }
  }, [folder]);

  useEffect(() => {
    if (photoId) {
      const image = images.find((img) => img.id === Number(photoId));
      setSelectedImage(image || null);
    }
  }, [photoId, images]);

  return (
    <>
      <Header 
      autoPlay={autoPlay} 
      handlePreviousImage={handlePreviousImage}
      handleNextImage={handleNextImage}
      handleToggleAutoPlay={handleToggleAutoPlay} 
    />
      <Gallery images={images} />
      <Footer />
    </>
  );
};

export async function getStaticProps() {
  const folder = process.env.NEXT_PUBLIC_DEFAULT_FOLDER || "default";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  console.log('Base URL:', baseUrl);

  let client: MongoClient | null = null;
  try {
    client = await clientPromise();
    const db = client.db();
    const metadataCollection = db.collection('image_metadata');

    const res = await fetch(`${baseUrl}/api/images?folder=${folder}`);
    if (!res.ok) {
      console.error(`Failed to fetch images: ${res.statusText}`);
      return { props: { initialImages: [] } };
    }
    const data = await res.json();

    // Fetch metadata from MongoDB
    const metadata = await metadataCollection.find({}).toArray();
    console.log('Fetched metadata:', metadata);

    // Merge metadata with images
    const imagesWithMetadata = data.images.map((image: ImageProps) => {
      const meta = metadata.find(m => m.public_id === image.public_id);
      console.log('Matching metadata:', meta);
      return {
        ...image,
        title: meta?.title || '',
        description: meta?.description || '',
      };
    });

    console.log('Images with metadata:', imagesWithMetadata);

    return {
      props: {
        initialImages: imagesWithMetadata,
      },
    };
  } catch (error) {
    console.error('Error fetching images in getStaticProps:', error);
    return {
      props: {
        initialImages: [],
      },
    };
  } finally {
    // Close the MongoDB connection after use
    if (client) {
      await client.close(); 
    }
  }
}

export default Home;
