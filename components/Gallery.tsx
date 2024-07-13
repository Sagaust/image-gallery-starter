import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import type { ImageProps } from '../utils/types';
import GalleryModal from './GalleryModal';
import { useLastViewedPhoto } from '../utils/useLastViewedPhoto';
import Logo from '../components/Icons/Logo';
import ImageCard from './ImageCard';

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
            <div className="mt-2 p-4 bg-gray-100 rounded-lg shadow-lg">
              {selectedImage.title && <h3 className="text-lg font-semibold">{selectedImage.title}</h3>}
              {selectedImage.description && <p className="mt-2">{selectedImage.description}</p>}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Logo />
              <h1 className="mt-8 mb-4 text-base font-bold uppercase tracking-widest">
                2022 Event Photos
              </h1>
              <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">
                Our incredible Next.js community got together in San Francisco for our first ever in-person conference!
              </p>
              <a
                className="pointer z-10 mt-6 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white md:mt-4"
                href="https://vercel.com/new/clone?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-cloudinary&project-name=nextjs-image-gallery&repository-name=with-cloudinary&env=NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET,CLOUDINARY_FOLDER&envDescription=API%20Keys%20from%20Cloudinary%20needed%20to%20run%20this%20application"
                target="_blank"
                rel="noreferrer"
              >
                Clone and Deploy
              </a>
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
