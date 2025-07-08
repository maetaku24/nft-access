import imageCompression from 'browser-image-compression';

export const compressImageFile = async (file: File) => {
  // プロフィール画像用
  if (file.type.startsWith('image/')) {
    const options = {
      maxSizeMB: 0.5, // 500KB以下
      maxWidthOrHeight: 800, // 800px以下
      useWebWorker: true,
    };

    return await imageCompression(file, options);
  }

  return file;
};
