import imageCompression from 'browser-image-compression';

export const compressImageFile = async (imageFile, maxImageSizeMb) => {
  const compressedFile = await imageCompression(imageFile, {
    maxSizeMB: maxImageSizeMb,
    maxWidthOrHeight: 560,
    useWebWorker: true,
  });
  return compressedFile;
};
