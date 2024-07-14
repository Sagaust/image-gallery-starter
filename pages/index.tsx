// pages/index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Gallery from "../components/Gallery";
import type { ImageProps } from "../utils/types";
import path from 'path';
import { readCSV } from '../utils/readCSV';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Home: React.FC<{ initialImages: ImageProps[] }> = ({ initialImages }) => {
  const [images, setImages] = useState<ImageProps[]>(initialImages);
  const router = useRouter();
  const { folder } = router.query;

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

  return (
    <>
      <Header />
      <Gallery images={images} />
      <Footer />
    </>
  );
};

export async function getStaticProps() {
  const folder = process.env.NEXT_PUBLIC_DEFAULT_FOLDER || "default";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const res = await fetch(`${baseUrl}/api/images?folder=${folder}`);
    if (!res.ok) {
      console.error(`Failed to fetch images: ${res.statusText}`);
      return { props: { initialImages: [] } };
    }
    const data = await res.json();

    // Read metadata from CSV file
    const csvFilePath = path.join(process.cwd(), 'phil_course.csv');
    const metadata = await readCSV(csvFilePath);

    // Merge metadata with images
    const imagesWithMetadata = data.images.map((image: ImageProps) => {
      const meta = metadata.find(m => m.public_id === image.public_id);
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
