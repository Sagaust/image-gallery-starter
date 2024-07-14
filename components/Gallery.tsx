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
                alt="Selected gallery photo"
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
                  title="Welcome to Philos d - Learning Philosophy Through Pictures"
                  content={`Philos d is an innovative project designed to make learning philosophy both engaging and accessible. By utilizing AI-generated images and a powerful backend infrastructure, we bring philosophical concepts to life through captivating visuals.`}
                />
                <Accordion
                  title="A Unique Approach to Understanding Philosophy"
                  content={`Our application seamlessly integrates frontend and backend technologies, with Next.js providing a robust framework for development and MongoDB handling our database operations. Images are stored and fetched from Superbase, an advanced image database, ensuring high efficiency and performance.`}
                />
                <Accordion
                  title="Cutting-Edge Technology"
                  content={`Handling a large volume of images is made simple with our automated metadata processing. Images and their metadata, including titles and descriptions, are programmatically fetched and organized. This ensures a streamlined and user-friendly experience.`}
                />
                <Accordion
                  title="Automated Metadata Processing"
                  content={`Images are categorized into clearly named folders in Superbase, allowing users to easily navigate and find the content they need. Each folder can be accessed through environmental variables defined in the .env.local file, ensuring secure and organized data management.`}
                />
                <Accordion
                  title="Organized Image Folders"
                  content={`Our application is built with a variety of dynamic components to enhance user experience:
                    - Sidebar: Displays images based on the user’s selection from the navigation menu. For example, choosing "Philosophy Courses" fetches related images from the corresponding folder in Superbase.
                    - Main Content Area: Shows a larger version of the selected image. Users can navigate through images using control buttons to move forward, backward, or play a slideshow.
                    - Image Modal: Clicking on a larger image opens an image modal with a carousel for quick navigation through the collection. The modal supports full-screen display and image downloading with proper attribution.`}
                />
                <Accordion
                  title="Dynamic Components"
                  content={`- Collapsible Descriptions: Image descriptions are initially collapsed, allowing users to click and view detailed information as needed.
                    - Control Buttons: Easily navigate through images with forward, backward, play, and pause controls.
                    - Full-Screen Mode: View images in full-screen for a more immersive experience.`}
                />
                <Accordion
                  title="User-Friendly Navigation"
                  content={`Our app is designed to assist learners at all levels—beginners, intermediates, and advanced students. By visualizing complex philosophical concepts through AI-generated images, we make abstract ideas more concrete and understandable.`}
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
