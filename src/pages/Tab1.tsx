import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonButton,
  IonIcon,
  IonAlert,
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addAlbum } from '../store/gallerySlice';
import { v4 as uuidv4 } from 'uuid';
import { Album } from '../types'; // Make sure this import exists
import './Tab1.css';

const Tab1: React.FC = () => {
  const dispatch = useDispatch();
  const albums = useSelector((state: RootState) => state.gallery.albums);
  const [showNewAlbumAlert, setShowNewAlbumAlert] = useState(false);

  const handleCreateAlbum = (name: string) => {
    if (name.trim()) {
      const newAlbum: Album = {
        id: uuidv4(),
        name: name.trim(),
        photos: [],
        coverPhoto: undefined
      };
      
      dispatch(addAlbum(newAlbum));
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Albums</IonTitle>
          <IonButton 
            slot="end" 
            fill="clear"
            onClick={() => setShowNewAlbumAlert(true)}
          >
            <IonIcon icon={addOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {albums.length === 0 ? (
          <div className="empty-state">
            <p>No albums yet. Create one to get started!</p>
          </div>
        ) : (
          <IonList>
            {albums.map((album) => (
              <IonItem key={album.id} routerLink={`/album/${album.id}`}>
                <IonThumbnail slot="start">
                  <img
                    alt={album.name}
                    src={album.coverPhoto?.webviewPath || 'assets/placeholder.jpg'}
                  />
                </IonThumbnail>
                <IonLabel>
                  <h2>{album.name}</h2>
                  <p>{album.photos.length} photos</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}

        <IonAlert
          isOpen={showNewAlbumAlert}
          onDidDismiss={() => setShowNewAlbumAlert(false)}
          header="New Album"
          inputs={[
            {
              name: 'name',
              type: 'text',
              placeholder: 'Enter album name'
            }
          ]}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Create',
              handler: (data) => handleCreateAlbum(data.name)
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
