import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import type { ImageProps } from '../utils/types';
import GalleryModal from './GalleryModal';
import { useLastViewedPhoto } from '../utils/useLastViewedPhoto';
import Logo from '../components/Icons/Logo';
import ImageCard from './ImageCard';
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
  const lastViewedPhotoRef = useRef<HTMLDivElement>(null);

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

  return (
    <main className="flex h-screen bg-gray-100">
      <aside className="w-1/4 overflow-y-scroll p-4 bg-gray-800">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} onClick={() => handleSidebarImageClick(image.id)} />
        ))}
      </aside>
      <section className="flex-1 p-4 overflow-y-auto">
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
            <div className="mt-2 p-4 bg-gray-800 rounded-lg shadow-lg text-white">
              {selectedImage.title && <h3 className="text-lg font-semibold">{selectedImage.title}</h3>}
              {selectedImage.description && <p className="mt-2">{selectedImage.description}</p>}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-800">
            <div className="text-center">
              <Logo />
              <h1 className="mt-8 mb-4 text-base font-bold uppercase tracking-widest text-white">
                Welcome to Philos d
              </h1>
              <Accordion title="Project Overview">
                <p>
                  Philos d is an innovative project designed to make learning philosophy both engaging and accessible.
                  By utilizing AI-generated images and a powerful backend infrastructure, we bring philosophical
                  concepts to life through captivating visuals.
                </p>
              </Accordion>
              <Accordion title="Technology Stack">
                <p>
                  Our application seamlessly integrates frontend and backend technologies, with Next.js providing a robust
                  framework for development and MongoDB handling our database operations. Images are stored and fetched
                  from Superbase, an advanced image database, ensuring high efficiency and performance.
                </p>
              </Accordion>
              <Accordion title="Image Management">
                <p>
                  Handling a large volume of images is made simple with our automated metadata processing. Images and
                  their metadata, including titles and descriptions, are programmatically fetched and organized. This
                  ensures a streamlined and user-friendly experience.
                </p>
              </Accordion>
              <Accordion title="Categorization">
                <p>
                  Images are categorized into clearly named folders in Superbase, allowing users to easily navigate and
                  find the content they need. Each folder can be accessed through environmental variables defined in the
                  .env.local file, ensuring secure and organized data management.
                </p>
              </Accordion>
              <Accordion title="User Experience">
                <p>
                  Our application is built with a variety of dynamic components to enhance user experience. The sidebar
                  displays images based on the user’s selection from the navigation menu. The main content area shows a
                  larger version of the selected image, and users can navigate through images using control buttons to
                  move forward, backward, or play a slideshow.
                </p>
              </Accordion>
              <Accordion title="Learning Through Visualization">
                <p>
                  By visualizing complex philosophical concepts through AI-generated images, we make abstract ideas more
                  concrete and understandable. We value your feedback and contributions. Please share your remarks,
                  comments, suggestions, and experiences by clicking on the Contact Us button.
                </p>
              </Accordion>
              <Accordion title="Contact Us">
                <p>
                  Thank you for using the Philos DH Picture Gallery App. Dive into the world of philosophy with us and
                  explore the rich visual representations of philosophical ideas.
                </p>
              </Accordion>
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
