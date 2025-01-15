import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { Image } from '../models/Image.js';
import { Gallery } from '../models/Gallery.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const imageController = {
    uploadImage: asyncHandler(async (req, res) => {
        if (!req.file) {
            throw new ApiError(400, 'No image file provided');
        }

        const { galleryId, name, description, tags } = req.body;
        const originalPath = req.file.path;
        const filename = req.file.filename;
        const thumbnailPath = path.join('uploads/thumbnails', `thumb-${filename}`);

        try {
            // Create thumbnail
            await sharp(originalPath)
                .resize(200, 200, { fit: 'cover' })
                .toFile(path.join(process.cwd(), thumbnailPath));

            // Get image metadata
            const metadata = await sharp(originalPath).metadata();

            // Create image document
            const imageData = {
                filename,
                originalName: name || req.file.originalname,
                path: originalPath,
                thumbnailPath,
                size: req.file.size,
                mimeType: req.file.mimetype,
                description: description || '',
                tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
                gallery: galleryId || null,
                metadata: {
                    width: metadata.width,
                    height: metadata.height,
                    format: metadata.format
                }
            };

            const image = await Image.create(imageData);

            // Update gallery if specified
            if (galleryId) {
                await Gallery.findByIdAndUpdate(galleryId, {
                    $push: { images: image._id },
                    $inc: { imageCount: 1 },
                    $set: { updatedAt: new Date() }
                });
            }

            const populatedImage = await Image.findById(image._id).populate('gallery', 'name');

            res.status(201).json({
                success: true,
                data: populatedImage
            });
        } catch (error) {
            // Clean up uploaded files if there's an error
            try {
                await fs.unlink(originalPath);
                if (fs.existsSync(path.join(process.cwd(), thumbnailPath))) {
                    await fs.unlink(path.join(process.cwd(), thumbnailPath));
                }
            } catch (cleanupError) {
                console.error('Error cleaning up files:', cleanupError);
            }
            throw error;
        }
    }),

    getImages: asyncHandler(async (req, res) => {
        const { gallery } = req.query;
        const query = gallery ? { gallery } : {};

        const images = await Image.find(query)
            .populate('gallery', 'name')
            .sort('-createdAt');

        res.json({
            success: true,
            data: images
        });
    }),

    getImage: asyncHandler(async (req, res) => {
        const image = await Image.findById(req.params.id).populate('gallery', 'name');
        
        if (!image) {
            throw new ApiError(404, 'Image not found');
        }

        res.json({
            success: true,
            data: image
        });
    }),

    updateImage: asyncHandler(async (req, res) => {
        const { galleryId, ...updateData } = req.body;
        const image = await Image.findById(req.params.id);

        if (!image) {
            throw new ApiError(404, 'Image not found');
        }

        // Handle gallery change
        if (galleryId !== undefined && galleryId !== image.gallery?.toString()) {
            // Remove from old gallery
            if (image.gallery) {
                await Gallery.findByIdAndUpdate(image.gallery, {
                    $pull: { images: image._id },
                    $inc: { imageCount: -1 },
                    $set: { updatedAt: new Date() }
                });
            }

            // Add to new gallery
            if (galleryId) {
                await Gallery.findByIdAndUpdate(galleryId, {
                    $push: { images: image._id },
                    $inc: { imageCount: 1 },
                    $set: { updatedAt: new Date() }
                });
            }

            image.gallery = galleryId || null;
        }

        // Update other fields
        Object.assign(image, updateData);
        await image.save();

        const updatedImage = await Image.findById(image._id).populate('gallery', 'name');

        res.json({
            success: true,
            data: updatedImage
        });
    }),

    deleteImage: asyncHandler(async (req, res) => {
        const image = await Image.findById(req.params.id);

        if (!image) {
            throw new ApiError(404, 'Image not found');
        }

        // Remove from gallery if assigned
        if (image.gallery) {
            await Gallery.findByIdAndUpdate(image.gallery, {
                $pull: { images: image._id },
                $inc: { imageCount: -1 },
                $set: { updatedAt: new Date() }
            });
        }

        // Delete physical files
        try {
            await fs.unlink(path.join(process.cwd(), image.path));
            await fs.unlink(path.join(process.cwd(), image.thumbnailPath));
        } catch (error) {
            console.error('Error deleting files:', error);
        }

        await Image.deleteOne({ _id: image._id });

        res.json({
            success: true,
            message: 'Image deleted successfully'
        });
    })
};