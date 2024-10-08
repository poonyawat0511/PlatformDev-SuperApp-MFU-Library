import { diskStorage } from 'multer';
import { extname } from 'path';

export const storageConfig = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const extension = extname(file.originalname);
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extension}`);
  },
});
