import { Camera, CameraResultType, CameraSource, Photo as CameraPhoto } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Photo } from '../types';

export class PhotoService {
  public async takePhoto(): Promise<Photo> {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
        width: 1200
      });

      if (!capturedPhoto.webPath) {
        throw new Error('No webPath in captured photo');
      }

      const fileName = new Date().getTime() + '.jpeg';
      const savedFileImage = await this.savePicture(capturedPhoto, fileName);

      return {
        filepath: fileName,
        webviewPath: savedFileImage.webPath
      };
    } catch (error) {
      console.error('Error in takePhoto:', error);
      throw new Error('Failed to take photo');
    }
  }

  private async savePicture(photo: CameraPhoto, fileName: string) {
    try {
      const base64Data = await this.readAsBase64(photo);

      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data
      });

      return {
        filepath: fileName,
        webPath: photo.webPath!
      };
    } catch (error) {
      console.error('Error in savePicture:', error);
      throw new Error('Failed to save photo');
    }
  }

  private async readAsBase64(photo: CameraPhoto): Promise<string> {
    try {
      if (!photo.webPath) {
        throw new Error('No webPath found in photo');
      }

      const response = await fetch(photo.webPath);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob);
    } catch (error) {
      console.error('Error in readAsBase64:', error);
      throw new Error('Failed to process photo');
    }
  }

  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }
} 