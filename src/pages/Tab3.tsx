import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonActionSheet,
  IonSearchbar,
} from '@ionic/react';
import { trash, share } from 'ionicons/icons';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { deletePhoto } from '../store/gallerySlice';
import { Photo } from '../types';
import './Tab3.css';

const Tab3: React.FC = () => {
  const dispatch = useDispatch();
  const photos = useSelector((state: RootState) => state.gallery.photos);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [searchText, setSearchText] = useState('');

  const handleDeletePhoto = (filepath: string) => {
    dispatch(deletePhoto(filepath));
    setSelectedPhoto(null);
  };

  const filteredPhotos = photos.filter(photo => 
    photo.filepath.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Gallery</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonSearchbar
          value={searchText}
          onIonInput={e => setSearchText(e.detail.value || '')}
          placeholder="Search photos"
        />

        <IonGrid>
          <IonRow>
            {filteredPhotos.map((photo, index) => (
              <IonCol size="4" key={photo.filepath || index}>
                <IonImg
                  src={photo.webviewPath}
                  onClick={() => setSelectedPhoto(photo)}
                  className="gallery-image"
                />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonActionSheet
          isOpen={!!selectedPhoto}
          buttons={[
            {
              text: 'Delete',
              role: 'destructive',
              icon: trash,
              handler: () => {
                if (selectedPhoto) {
                  handleDeletePhoto(selectedPhoto.filepath);
                }
              },
            },
            {
              text: 'Share',
              icon: share,
              handler: () => {
                // Add share functionality here
                console.log('Share clicked');
              },
            },
            {
              text: 'Cancel',
              role: 'cancel',
            },
          ]}
          onDidDismiss={() => setSelectedPhoto(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
