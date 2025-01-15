import { Gallery } from '../models/Gallery.js';
import { Image } from '../models/Image.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

export const galleryController = {
    getGalleries: asyncHandler(async (req, res) => {
        const galleries = await Gallery.find()
            .populate({
                path: 'images',
                select: 'originalName path thumbnailPath size description'
            })
            .sort('-createdAt');

        res.json({
            success: true,
            data: galleries
        });
    }),

    getGallery: asyncHandler(async (req, res) => {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, 'Invalid gallery ID format');
        }

        const gallery = await Gallery.findById(id)
            .populate({
                path: 'images',
                select: 'originalName path thumbnailPath size description'
            });

        if (!gallery) {
            throw new ApiError(404, 'Gallery not found');
        }

        res.json({
            success: true,
            data: gallery
        });
    }),

    createGallery: asyncHandler(async (req, res) => {
        const { name, description } = req.body;

        if (!name) {
            throw new ApiError(400, 'Gallery name is required');
        }

        const gallery = await Gallery.create({
            name,
            description,
            images: [],
            imageCount: 0
        });

        res.status(201).json({
            success: true,
            data: gallery
        });
    }),

    updateGallery: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { name, description } = req.body;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, 'Invalid gallery ID format');
        }

        const gallery = await Gallery.findById(id);

        if (!gallery) {
            throw new ApiError(404, 'Gallery not found');
        }

        if (name) gallery.name = name;
        if (description !== undefined) gallery.description = description;
        gallery.updatedAt = new Date();

        await gallery.save();

        const updatedGallery = await Gallery.findById(gallery._id)
            .populate({
                path: 'images',
                select: 'originalName path thumbnailPath size description'
            });

        res.json({
            success: true,
            data: updatedGallery
        });
    }),

    deleteGallery: asyncHandler(async (req, res) => {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, 'Invalid gallery ID format');
        }

        const gallery = await Gallery.findById(id);

        if (!gallery) {
            throw new ApiError(404, 'Gallery not found');
        }

        // Update all images to remove gallery reference
        await Image.updateMany(
            { gallery: gallery._id },
            { 
                $set: { 
                    gallery: null,
                    updatedAt: new Date()
                }
            }
        );

        await gallery.deleteOne();

        res.json({
            success: true,
            message: 'Gallery deleted successfully'
        });
    })
};