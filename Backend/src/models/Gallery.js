import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    imageCount: {
        type: Number,
        default: 0
    },
    coverImage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

gallerySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    this.updatedAt = new Date();
    next();
});

// Populate images when finding galleries
gallerySchema.pre(/^find/, function(next) {
    this.populate('images', 'originalName path thumbnailPath');
    this.populate('coverImage', 'thumbnailPath');
    next();
});

export const Gallery = mongoose.model('Gallery', gallerySchema);