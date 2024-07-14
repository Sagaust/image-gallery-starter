import Image from "next/image";
import { useRouter } from "next/router";
import useKeypress from "react-use-keypress";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import SharedModal from "./SharedModal";

interface CarouselProps {
  index: number;
  currentPhoto: ImageProps;
  images: ImageProps[]; // Add this line to define the images prop
}

export default function Carousel({ index, currentPhoto, images }: CarouselProps) {
  const router = useRouter();
  const [, setLastViewedPhoto] = useLastViewedPhoto();

  function closeModal() {
    setLastViewedPhoto(currentPhoto.id);
    router.push("/", undefined, { shallow: true });
  }

  function changePhotoId(newVal: number) {
    return newVal;
  }

  useKeypress("Escape", () => {
    closeModal();
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <button
        className="absolute inset-0 z-30 cursor-default bg-black backdrop-blur-2xl"
        onClick={closeModal}
      >
        <Image
          src={currentPhoto.blurDataUrl}
          className="pointer-events-none h-full w-full"
          alt="blurred background"
          fill
          priority={true}
        />
      </button>
      <SharedModal
        index={index}
        images={images} // Pass the images prop here
        changePhotoId={changePhotoId}
        currentPhoto={currentPhoto}
        closeModal={closeModal}
        navigation={false}
      />
    </div>
  );
}
