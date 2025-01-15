import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { config } from '../config/config';

const UnassignedImages = ({ images }) => {
  return (
    <Droppable droppableId="unassigned" direction="horizontal">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 p-4 rounded-lg ${
            snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-white'
          }`}
        >
          {images.map((image, index) => (
            <Draggable key={image._id} draggableId={image._id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`group relative ${
                    snapshot.isDragging ? 'z-50' : 'z-0'
                  }`}
                >
                  <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={`${config.apiUrl}/${image.thumbnailPath || image.path}`}
                      alt={image.originalName}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200">
                      <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        {image.originalName}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default UnassignedImages;