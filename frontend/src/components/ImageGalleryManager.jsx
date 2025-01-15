import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { PlusIcon, PhotoIcon } from '@heroicons/react/24/outline';
import ImageUploader from './ImageUploader';
import GalleryGrid from './GalleryGrid';
import ImagesList from './ImagesList';

const ImageGalleryManager = ({ 
  onImageUpload,  // Function to handle image upload
  onImageMove,    // Function to handle image movement between galleries
  onGalleryCreate, // Function to create new gallery
  onGalleryDelete, // Function to delete gallery
  apiEndpoint,    // API endpoint for the backend
  initialData     // Initial galleries and images data
}) => {
  const [galleries, setGalleries] = useState(initialData?.galleries || []);
  const [images, setImages] = useState(initialData?.images || []);
  const [showUploader, setShowUploader] = useState(false);

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const imageId = draggableId;
    const newGalleryId = destination.droppableId;
    
    try {
      await onImageMove(imageId, newGalleryId);
      
      // Update local state
      setImages(prevImages =>
        prevImages.map(image =>
          image._id === imageId
            ? { ...image, gallery: newGalleryId === 'unassigned' ? null : newGalleryId }
            : image
        )
      );
    } catch (error) {
      console.error('Failed to move image:', error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header with actions */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Image Gallery Manager</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowUploader(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PhotoIcon className="h-5 w-5 mr-2" />
                Upload Image
              </button>
              <button
                onClick={onGalleryCreate}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Gallery
              </button>
            </div>
          </div>
        </div>

        {/* Galleries Grid */}
        <div className="max-w-7xl mx-auto mb-12">
          <GalleryGrid 
            galleries={galleries} 
            images={images}
            onGalleryDelete={onGalleryDelete}
          />
        </div>

        {/* Unassigned Images List */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Unassigned Images</h2>
          <ImagesList 
            images={images.filter(img => !img.gallery)} 
          />
        </div>

        {/* Image Upload Modal */}
        {showUploader && (
          <ImageUploader
            onClose={() => setShowUploader(false)}
            onUpload={async (imageData) => {
              const newImage = await onImageUpload(imageData);
              setImages(prev => [...prev, newImage]);
              setShowUploader(false);
            }}
            galleries={galleries}
            onGalleryCreate={onGalleryCreate}
          />
        )}
      </div>
    </DragDropContext>
  );
};

export default ImageGalleryManager;