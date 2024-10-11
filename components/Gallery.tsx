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
// import Accordion from './Accordion'; // Keep this commented out

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
                alt={selectedImage.title || 'Selected gallery photo'}
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
              {/* Replace Accordion with direct text elements */}
              <div className="mt-4">
                <h2 className="text-2xl font-bold">
                  {selectedImage.title || 'No Title'}
                </h2>
                <p className="mt-2 text-base leading-6">
                  {selectedImage.description || 'No Description'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-3xl mx-auto p-4">
                <Logo />
                <div className="mt-6">
                  <h1 className="text-3xl font-bold">Welcome to Philosophy AI LAB</h1>

                  <h1 className="text-2xl font-bold mt-6">Welcome to Philosophy AI LAB</h1>
                  <p className="mt-2 text-base leading-6">
                    The goal of this project is to explore various ways in which Text-to-Image (TTI) AI models can enhance the visualization and reinterpretation of philosophical concepts, ideas, theories, and thought experiments. It addresses how we can better understand complex philosophical terminologies through imaginative and perceptual experiences of AI-generated images.
                  </p>
                  <p className="mt-4 text-base leading-6">
                    As a researcher in Experimental Philosophy, Visual Epistemology, and Digital Humanities, I have created this gallery to serve as a digital resource that helps users develop their own subjective interpretations of images through immersive experiences and reflective engagement with the collections.
                  </p>

                  <h2 className="text-2xl font-bold mt-6">Quick Tips for Smooth Exploration of This Platform:</h2>
                  <ul className="mt-2 text-base leading-6 text-left list-disc list-inside">
                    <li>
                      <strong>To View Image Collections</strong>: Click on the buttons in the menu bar.
                    </li>
                    <li className="mt-1">
                      <strong>To View Images in Full Screen</strong>: Click on the thumbnails in the sidebar.
                    </li>
                    <li className="mt-1">
                      <strong>To Start the Image Carousel</strong>: Click on the large images shown in the main content area.
                    </li>
                  </ul>

                  <h2 className="text-2xl font-bold mt-6">Acknowledgements:</h2>
                  <p className="mt-2 text-base leading-6">
                    In developing this project, I adapted code available from Vercel’s Image Gallery Starter Template and used Next.js (as the web framework), Cloudinary (for storing images), Tailwind CSS (for styling), and MongoDB (as the database storage). All the images were generated using AI models with prompts crafted using ChatGPT 4.0. For continuous development, I intend to include my prompts, titles, or descriptions to provide users with a more enriched and informative experience.
                  </p>
                  <p className="mt-4 text-base leading-6">
                    Note that this is an open-source project, and anyone can freely download these images and reference this portal. For further information or suggestions, kindly contact me, Augustine Farinola, via email at{' '}
                    <a href="mailto:austineaf@gmail.com" className="text-blue-500 underline">
                      austineaf@gmail.com
                    </a>.
                  </p>
                </div>
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
