import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    thumbnailPath: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    tags: [{
        type: String,
        trim: true
    }],
    gallery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gallery'
    },
    metadata: {
        width: Number,
        height: Number,
        format: String
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

// Add pre-save middleware to update timestamps
imageSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

export const Image = mongoose.model('Image', imageSchema);