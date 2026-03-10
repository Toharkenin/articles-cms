import { Router } from 'express';
import upload from '../middleware/upload-image';
import { requireAdminAuth } from '../middleware/admin-auth';

const router = Router();

interface S3File extends Express.Multer.File {
  location: string;
  key: string;
  bucket: string;
}

router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const s3File = req.file as S3File;

    return res.json({
      success: true,
      imageUrl: s3File.location,
      key: s3File.key,
      bucket: s3File.bucket,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
