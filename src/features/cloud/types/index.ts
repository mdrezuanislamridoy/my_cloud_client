export interface CloudFile {
  id: string;
  name: string;
  data: string;        // public URL
  publicKey: string;
  fileSize?: number;
  fileType?: string;
  uploaded_at: string;
  // aliases used in UI
  url?: string;
  size?: number;
  mimeType?: string;
  createdAt?: string;
}
