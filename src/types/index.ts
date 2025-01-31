export interface Photo {
  filepath: string;
  webviewPath: string;
  base64?: string;
}

export interface Album {
  id: string;
  name: string;
  photos: Photo[];
  coverPhoto?: Photo;
}

export interface GalleryState {
  photos: Photo[];
  albums: Album[];
} 