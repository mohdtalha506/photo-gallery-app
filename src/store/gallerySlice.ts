import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Photo, Album, GalleryState } from '../types';

const initialState: GalleryState = {
  photos: [],
  albums: []
};

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    addPhoto: (state, action: PayloadAction<Photo>) => {
      state.photos.unshift(action.payload);
    },
    deletePhoto: (state, action: PayloadAction<string>) => {
      state.photos = state.photos.filter(photo => photo.filepath !== action.payload);
    },
    addAlbum: (state, action: PayloadAction<Album>) => {
      state.albums.push(action.payload);
    },
    addPhotoToAlbum: (state, action: PayloadAction<{ albumId: string; photo: Photo }>) => {
      const album = state.albums.find(a => a.id === action.payload.albumId);
      if (album) {
        album.photos.push(action.payload.photo);
        if (!album.coverPhoto) {
          album.coverPhoto = action.payload.photo;
        }
      }
    }
  }
});

export const { addPhoto, deletePhoto, addAlbum, addPhotoToAlbum } = gallerySlice.actions;
export default gallerySlice.reducer; 