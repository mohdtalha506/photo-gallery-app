import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonLoading,
  IonToast,
  IonActionSheet
} from '@ionic/react';
import { camera, trash, share } from 'ionicons/icons';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { PhotoService } from '../services/photoService';
import { addPhoto, deletePhoto } from '../store/gallerySlice';
import { Photo } from '../types';
import './Tab2.css';

const photoService = new PhotoService();

const Tab2: React.FC = () => {
  const dispatch = useDispatch();
  const photos = useSelector((state: RootState) => state.gallery.photos);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const takePhoto = async () => {
    try {
      setIsLoading(true);
      const photo = await photoService.takePhoto();
      dispatch(addPhoto(photo));
    } catch (error) {
      console.error('Failed to take photo', error);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleDeletePhoto = (filepath: string) => {
    dispatch(deletePhoto(filepath));
    setSelectedPhoto(null);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Photo Gallery</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size="6" key={photo.filepath || index}>
                <IonImg 
                  src={photo.webviewPath} 
                  onClick={() => handlePhotoClick(photo)}
                  className="gallery-image" 
                />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={takePhoto}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>

        <IonLoading
          isOpen={isLoading}
          message="Taking photo..."
          duration={3000}
        />

        <IonToast
          isOpen={showError}
          onDidDismiss={() => setShowError(false)}
          message="Failed to take photo"
          duration={2000}
          color="danger"
        />

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

export default Tab2;
