export type ImageProps = {
  id: number;
  public_id: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  url: string;
  secure_url: string;
  folder: string;
  blurDataUrl?: string;
  title?: string; // Add title field
  description?: string; // Add description field
};
