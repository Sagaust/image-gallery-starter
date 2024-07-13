// components/Gallery.tsx
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import type { ImageProps } from '../utils/types';
import GalleryModal from './GalleryModal';
import { useLastViewedPhoto } from '../utils/useLastViewedPhoto';
import Logo from '../components/Icons/Logo';
import ImageCard from './ImageCard';
import ControlPanel from './ControlPanel';

interface GalleryProps {
  images: ImageProps[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lastViewedPhotoRef = useRef<HTMLDivElement>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        handleNextImage();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, currentIndex]);

  const handleSidebarImageClick = (id: number) => {
    setSelectedImage(images.find((img) => img.id === id) || null);
    router.push(`/?photoId=${id}`, undefined, { shallow: true });
    setCurrentIndex(images.findIndex((img) => img.id === id));
  };

  const handleMainImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/', undefined, { shallow: true });
  };

  const handleNextImage = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
    router.push(`/?photoId=${images[nextIndex].id}`, undefined, { shallow: true });
  };

  const handlePreviousImage = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
    router.push(`/?photoId=${images[prevIndex].id}`, undefined, { shallow: true });
  };

  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
  };

  return (
    <main className="flex h-screen">
      <aside className="w-1/4 overflow-y-scroll p-4 bg-gray-800">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} onClick={() => handleSidebarImageClick(image.id)} />
        ))}
      </aside>
      <section className="flex-1 p-4 relative">
        {selectedImage ? (
          <div className="relative cursor-pointer">
            <header className="flex justify-between items-center mb-4">
              <Logo />
              <ControlPanel
                autoPlay={autoPlay}
                toggleAutoPlay={toggleAutoPlay}
                handleNextImage={handleNextImage}
                handlePreviousImage={handlePreviousImage}
              />
            </header>
            <ImageCard image={selectedImage} onClick={handleMainImageClick} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Logo />
              <h1 className="mt-8 mb-4 text-base font-bold uppercase tracking-widest">
                Philos-DH AI Photo Gallery
              </h1>
              <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">
                Learning Philosophical Concepts, theories, and Courses through Pictures
              </p>
              
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
  );
};

export default Gallery;
