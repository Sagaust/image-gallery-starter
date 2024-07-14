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
                  title="About Philos DH Gallery"
                  content={`This project titled Philos DH: Learning Philosophy with the use of pictures is one of the outstanding projects that I've recently completed.
                  And it's exciting for many reasons because we have the combination of front-end and back-end which Next.js enabled, and then we have the database operation coming from MongoDB and a powerful image database named Superbase from which the images are stored programmatically fetched in the development area, and the metadata are systematically processed through automation, knowing that the application involves a very large number of images.
                  Most of these images are AI generated and categorized into folders that are clearly named in the Superbase, and these folders are fetched separately in the app with the use of well-defined variables in the .env.local file, which is the environmental variables.
                  As you will see in the app, the app is made up of various components.
                  We have, in the landing page, the sidebar which has various images that come from the option that the user chooses in the navigation.
                  For instance, if the user chooses philosophy courses, the app communicates with the Superbase, which is the image repository, to fetch images particularly stored in the philosophy courses folder.
                  These images are fetched along with their metadata, with targets at the title and the description.
                  The descriptions are collapsed so all the detailed descriptions is not visible until the user clicks on it to be able to see the description and can hide it back and the user can scroll through the sidebar to navigate through the choice of the image they want to visualize in the main bar.
                  If they click on any image, it's going to be have the bigger version in the main bar and there is a control button, the main bar which enables them to either also navigate forward and backward or even play without touching. When they click on play, it's automatically through timing scrolls through the collections that they are currently in as selected in the navigation in the navigation bar.
                  Interestingly because of other components that are also in the app, when the user clicks on the bigger or the larger image in the main content area, an image model comes up which also has a corrosive and this enables them to have a very fast navigation through the bigger or the larger versions of the images and have it as a full screen display on their web browser.
                  And they also have the capability to also open their preferred image as a search tool, open a separate one on a full size screen in a different webpage while they still preserve the other webpage where they have the modal and the carousel.
                  Interestingly, they are also given the permission to be able to download the image and use it so far as it is referenced. The copyright is referenced from the work of the scholar or the digital humanist creator that works on this, so they can collapse and go back to the main page as well as interact further.
                  Essentially, the aim of the app is to help either beginners or intermediate or advanced students in philosophy to be able to understand difficult concepts through pictures in such a way that the ideas have been visualized through prompts that has been sent to the large language model that generates the images and those prompts were clearly given to light language model in such a way that we can visualize ideas and that is essentially what this app brings to the user.
                  I hope you'll be able to find your way through. Please. You can send your remarks, comments, contributions, opinion, suggestion, testimony, and experience across the user through by clicking on the Contact Us button.
                  Thanks for using this Philos DH picture gallery app.`}
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
