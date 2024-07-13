// utils/types.ts

// Define the ImageProps interface
export interface ImageProps {
  id: number;
  height: number;
  width: number;
  public_id: string;
  format: string;
  blurDataUrl?: string;
  title?: string;
  description?: string;
  details?: string;
}

// Define the SharedModalProps interface
export interface SharedModalProps {
  index: number;
  images: ImageProps[];
  changePhotoId: (id: number) => void;
  closeModal: () => void;
  navigation: boolean;
  currentPhoto?: ImageProps;
  direction?: number;
}
