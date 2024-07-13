// components/ImageCard.tsx
import { useState } from 'react';
import Image from 'next/image';
import type { ImageProps } from '../utils/types';

interface ImageCardProps {
  image: ImageProps;
  onClick: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onClick }) => {
  const { public_id, format, blurDataUrl, title, description } = image;
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

  const toggleDescriptionVisibility = () => {
    setIsDescriptionVisible(!isDescriptionVisible);
  };

  return (
    <div className="relative block mb-6 cursor-pointer group" onClick={onClick}>
      <Image
        alt={title || "Gallery photo"}
        className="rounded-lg shadow-lg transition-transform duration-300 transform group-hover:scale-105"
        placeholder="blur"
        blurDataURL={blurDataUrl}
        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
        width={720}
        height={480}
        sizes="(max-width: 640px) 100vw,
          (max-width: 1280px) 50vw,
          (max-width: 1536px) 33vw,
          25vw"
      />
      <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/70 to-transparent text-white">
        {title && <h3 className="text-lg font-semibold truncate">{title}</h3>}
      </div>
      <button
        className="absolute bottom-0 right-0 m-2 p-1 text-sm text-gray-800 bg-white rounded shadow"
        onClick={toggleDescriptionVisibility}
      >
        {isDescriptionVisible ? 'Hide Description' : 'Show Description'}
      </button>
      {isDescriptionVisible && (
        <div className="mt-2 p-4 bg-white shadow-lg rounded-lg">
          {description && <p className="text-gray-700">{description}</p>}
        </div>
      )}
    </div>
  );
};

export default ImageCard;
