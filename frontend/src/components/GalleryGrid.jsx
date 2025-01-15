import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { TrashIcon } from '@heroicons/react/24/outline';
import ImageItem from './ImageItem';

const GalleryGrid = ({ galleries, images, onGalleryDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {galleries.map(gallery => (
        <div
          key={gallery._id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{gallery.name}</h3>
              <p className="text-sm text-gray-500">{gallery.description || 'No description'}</p>
            </div>
            <button
              onClick={() => onGalleryDelete(gallery._id)}
              className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
              title="Delete gallery"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>

          <Droppable droppableId={gallery._id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`p-4 min-h-[200px] ${
                  snapshot.isDraggingOver ? 'bg-blue-50' : ''
                }`}
              >
                <div className="grid grid-cols-2 gap-2">
                  {images
                    .filter(img => img.gallery === gallery._id)
                    .map((image, index) => (
                      <ImageItem 
                        key={image._id}
                        image={image}
                        index={index}
                      />
                    ))}
                </div>
                {provided.placeholder}

                {images.filter(img => img.gallery === gallery._id).length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    Drop images here
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;