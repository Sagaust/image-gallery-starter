// components/GalleryModal.tsx
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import useKeypress from 'react-use-keypress';
import type { ImageProps } from '../utils/types';
import SharedModal from './SharedModal';

interface GalleryModalProps {
  images: ImageProps[];
  onClose?: () => void;
}

export default function GalleryModal({
  images,
  onClose,
}: GalleryModalProps) {
  let overlayRef = useRef();
  const router = useRouter();

  const { photoId } = router.query;
  let index = Number(photoId);

  const [direction, setDirection] = useState(0);
  const [curIndex, setCurIndex] = useState(index);

  function handleClose() {
    router.push('/', undefined, { shallow: true });
    onClose && onClose();
  }

  function changePhotoId(newVal: number) {
    if (newVal > index) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setCurIndex(newVal);
    router.push(
      {
        query: { photoId: newVal },
      },
      `/p/${newVal}`,
      { shallow: true },
    );
  }

  useKeypress('ArrowRight', () => {
    if (index + 1 < images.length) {
      changePhotoId(index + 1);
    }
  });

  useKeypress('ArrowLeft', () => {
    if (index > 0) {
      changePhotoId(index - 1);
    }
  });

  const selectedImage = images[curIndex];

  return (
    <Dialog
      static
      open={true}
      onClose={handleClose}
      initialFocus={overlayRef}
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      <Dialog.Overlay
        ref={overlayRef}
        as={motion.div}
        key="backdrop"
        className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <SharedModal
        index={curIndex}
        direction={direction}
        images={images}
        changePhotoId={changePhotoId}
        closeModal={handleClose}
        navigation={true}
      />
      {selectedImage && (
        <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
          {selectedImage.title && <p className="text-lg font-semibold">{selectedImage.title}</p>}
          {selectedImage.description && <p className="mt-2">{selectedImage.description}</p>}
          {selectedImage.details && <p className="mt-2 text-sm text-gray-600">{selectedImage.details}</p>}
        </div>
      )}
    </Dialog>
  );
}
