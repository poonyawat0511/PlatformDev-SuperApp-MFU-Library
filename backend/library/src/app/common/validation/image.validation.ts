import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  transform(files: { [key: string]: Express.Multer.File[] }): {
    [key: string]: Express.Multer.File[];
  } {
    const validFileTypes = /jpeg|jpg|png|gif/;
    const maxSizeInBytes = 255 * 1024; // 255 KB

    if (!files) return {};

    Object.keys(files).forEach((key) => {
      files[key].forEach((file) => {
        const ext = extname(file.originalname).toLowerCase().slice(1);
        if (!validFileTypes.test(ext)) {
          throw new BadRequestException(
            'Invalid file type. Only image files are allowed',
          );
        }
        if (file.size > maxSizeInBytes) {
          throw new BadRequestException(
            `File size exceeds the maximum allowed size of 255 KB`,
          );
        }
      });
    });

    return files;
  }
}
