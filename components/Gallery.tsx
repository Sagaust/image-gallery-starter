// components/Gallery.tsx
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import type { ImageProps } from '../utils/types';
import GalleryModal from './GalleryModal';
import { useLastViewedPhoto } from '../utils/useLastViewedPhoto';
import Logo from '../components/Icons/Logo';
import ImageCard from './ImageCard';
import Header from './Header';
import Accordion from './Accordion';


interface GalleryProps {
  images: ImageProps[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const lastViewedPhotoRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: 'center' });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  useEffect(() => {
    if (photoId) {
      const image = images.find((img) => img.id === Number(photoId));
      setSelectedImage(image || null);
    }
  }, [photoId, images]);

  const handleSidebarImageClick = (id: number) => {
    setSelectedImage(images.find((img) => img.id === id) || null);
    router.push(`/?photoId=${id}`, undefined, { shallow: true });
  };

  const handleMainImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/', undefined, { shallow: true });
  };

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
    if (autoPlay) {
      autoPlayRef.current = setInterval(() => {
        handleNextImage();
      }, 3000);
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, selectedImage]);

  return (
    <>
      <Header
        autoPlay={autoPlay}
        handlePreviousImage={handlePreviousImage}
        handleNextImage={handleNextImage}
        handleToggleAutoPlay={handleToggleAutoPlay}
      />
      <main className="flex h-screen">
        <aside className="w-1/4 overflow-y-scroll p-4 bg-gray-800">
          {images.map((image) => (
            <ImageCard key={image.id} image={image} onClick={() => handleSidebarImageClick(image.id)} />
          ))}
        </aside>
        <section className="flex-1 p-4">
          {selectedImage ? (
            <div onClick={handleMainImageClick} className="cursor-pointer">
              <Image
                alt={selectedImage.title || "Selected gallery photo"}
                className="rounded-lg"
                placeholder="blur"
                blurDataURL={selectedImage.blurDataUrl}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${selectedImage.public_id}.${selectedImage.format}`}
                width={1440}
                height={960}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 100vw,
                  (max-width: 1536px) 100vw,
                  100vw"
              />
              <Accordion
                title={selectedImage.title || 'No Title'}
                content={selectedImage.description || 'No Description'}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Logo />
                <Accordion
                  title="About Philos DH Gallery"
                  content={`This project titled Philos DH: Learning Philosophy with the use of pictures is one of the outstanding projects that I've recently completed.
                  And it's exciting for many reasons because we have the combination of front-end and back-end which Next.js enabled, and then we have the database operation coming from MongoDB and a powerful image database named Superbase from which the images are stored programmatically fetched in the development area, and the metadata are systematically processed through automation, knowing that the application involves a very large number of images.
                  Most of these images are AI generated and categorized into folders that are clearly named in the Superbase, and these folders are fetched separately in the app with the use of well-defined variables in the .env.local file, which is the environmental variables.
                  As you will see in the app, the app is made up of various components.
                  We have, in the landing page, the sidebar which has various images that come from the option that the user chooses in the navigation.
                  For instance, if the user chooses philosophy courses, the app communicates with the Superbase, which is the image repository, to fetch images particularly stored in the philosophy courses folder.
                  These images are fetched along with their metadata, including titles and descriptions, providing a rich and informative experience.
                  `}
                />
              </div>
            </div>
          )}
        </section>
        {isModalOpen && selectedImage && (
          <GalleryModal
            images={images}
            onClose={handleCloseModal}
          />
        )}
      </main>
    </>
  );
};

export default Gallery;
