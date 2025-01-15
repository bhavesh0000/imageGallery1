import express from "express";
import { galleryController } from "../controllers/galleryController.js";
import { cacheMiddleware } from "../middleware/cache.js";

const router =  express.Router()

router.post('/', galleryController.createGallery);
router.get('/',  galleryController.getGalleries);
router.get('/:id',  galleryController.getGallery);
router.patch('/:id', galleryController.updateGallery);
router.delete('/:id', galleryController.deleteGallery);

export default router