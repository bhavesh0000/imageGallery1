import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { config } from '../config/config';

const Gallery = ({ gallery, images, index }) => {
  console.log('Gallery props:', { gallery, images, index }); // Debug log

  const getImageUrl = (path) => {
    if (!path) return '';
    // Remove any leading slashes and join with API URL
    const cleanPath = path.replace(/^\/+/, '');
    return `${config.apiUrl}/${cleanPath}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">
          {gallery.name || 'Unnamed Gallery'}
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({images.length} {images.length === 1 ? 'image' : 'images'})
          </span>
        </h3>
      </div>

      <Droppable droppableId={gallery._id || 'unassigned'}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`p-4 min-h-[200px] ${
              snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-white'
            }`}
          >
            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((image, imageIndex) => {
                  console.log('Rendering image:', image); // Debug log
                  return (
                    <Draggable
                      key={image._id}
                      draggableId={image._id}
                      index={imageIndex}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`relative aspect-square group ${
                            snapshot.isDragging ? 'z-10' : 'z-0'
                          }`}
                        >
                          <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={getImageUrl(image.thumbnailPath || image.path)}
                              alt={image.originalName}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                              crossOrigin="anonymous"
                              onError={(e) => {
                                console.error('Image load error:', e);
                                e.target.src = 'https://via.placeholder.com/200'; // Fallback image
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                              <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {image.originalName}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400">
                No images in this gallery
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Gallery;