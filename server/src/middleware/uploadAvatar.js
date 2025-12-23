import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'eatclub/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    quality: 'auto:good',
    transformation: [{ width: 512, height: 512, crop: 'fill', gravity: 'face' }],
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only jpg, jpeg, png, and webp files are allowed'));
  },
});

export default uploadAvatar;
