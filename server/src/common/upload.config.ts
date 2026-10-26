import { randomBytes } from 'crypto';
import { extname, join } from 'path';
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

const ALLOWED = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

export const uploadDir = join(process.cwd(), 'uploads');

export const imageUploadOptions = {
  storage: diskStorage({
    destination: uploadDir,
    filename: (_req, file, callback) => {
      // Never trust the client's filename: it decides where the file lands.
      const ext = extname(file.originalname).toLowerCase();
      callback(null, `${Date.now()}-${randomBytes(8).toString('hex')}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const ext = extname(file.originalname).toLowerCase();
    if (!ALLOWED.includes(ext))
      return callback(
        new BadRequestException(`Only ${ALLOWED.join(', ')} images are allowed`),
        false,
      );
    callback(null, true);
  },
};

// The client stores an absolute URL, the same way it did with Supabase storage.
export function publicUrlFor(filename: string) {
  const port = Number(process.env.PORT) || 3000;
  const base = process.env.PUBLIC_URL || `http://localhost:${port}`;
  return `${base}/uploads/${filename}`;
}
