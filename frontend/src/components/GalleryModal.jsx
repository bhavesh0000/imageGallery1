import React, { useState } from 'react';
import { XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { config } from '../config/config';

const GalleryModal = ({ isOpen, onClose, gallery }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!isOpen) return null;

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="fixed inset-0 z-50">
      {selectedImage ? (
        // Full-screen image view
        <div className="fixed inset-0 bg-black">
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <button
              onClick={() => setSelectedImage(null)}
              className="p-2 text-white hover:bg-white/10 rounded-full"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white/10 rounded-full"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="h-full flex items-center justify-center p-8">
            <img
              src={`${config.apiUrl}/${selectedImage.path}`}
              alt={selectedImage.originalName}
              className="max-h-full max-w-full object-contain"
              crossOrigin="anonymous"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-white text-lg font-medium">{selectedImage.originalName}</h3>
          </div>
        </div>
      ) : (
        // Gallery grid view
        <div className="h-full bg-white overflow-auto">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{gallery.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {gallery.images?.length || 0} images
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {gallery.images?.map((image) => (
                <div
                  key={image._id}
                  className="group relative cursor-pointer"
                  onClick={() => handleImageClick(image)}
                >
                  <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={`${config.apiUrl}/${image.thumbnailPath || image.path}`}
                      alt={image.originalName}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity" />
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.originalName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(image.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {(!gallery.images || gallery.images.length === 0) && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No images in this gallery</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryModal;