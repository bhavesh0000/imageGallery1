import express from 'express';
import multer from 'multer';
import path from 'path';
import { imageController } from '../controllers/imageController.js';

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        console.log('Multer generating filename for:', file);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure multer upload
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log('Multer checking file:', file);
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only images are allowed'), false);
        }
        cb(null, true);
    }
});

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Request file:', req.file);
    next();
});

router.post('/', (req, res, next) => {
    console.log('Before upload middleware');
    upload.single('image')(req, res, (err) => {
        console.log('After upload middleware');
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({
                success: false,
                error: { message: err.message }
            });
        }
        console.log('File uploaded:', req.file);
        next();
    });
}, imageController.uploadImage);

router.get('/', imageController.getImages);
router.get('/:id', imageController.getImage);
router.patch('/:id', imageController.updateImage);
router.delete('/:id', imageController.deleteImage);

export default router;