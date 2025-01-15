import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PlusIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ImageUploader from './ImageUploader';
import { config } from '../config/config';

const GalleryList = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);

  const fetchData = async () => {
    try {
      const galleriesRes = await axios.get(`${config.apiUrl}/api/galleries`);
      if (galleriesRes.data.success) {
        setGalleries(galleriesRes.data.data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load galleries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    try {
      await axios.patch(`${config.apiUrl}/api/images/${draggableId}`, {
        galleryId: destination.droppableId === 'unassigned' ? null : destination.droppableId
      });
      await fetchData();
      toast.success('Image moved successfully');
    } catch (error) {
      toast.error('Failed to move image');
    }
  };

  const renderUnassignedImages = (images) => (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Unassigned Images</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={image._id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={`${config.apiUrl}/${image.thumbnailPath}`}
                alt={image.originalName}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <p className="mt-2 text-sm truncate">{image.originalName}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Galleries</h1>
            <button
              onClick={() => setShowUploader(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PhotoIcon className="h-5 w-5 mr-2" />
              Upload Image
            </button>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map(gallery => (
              <Droppable key={gallery._id} droppableId={gallery._id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                      snapshot.isDraggingOver ? 'ring-2 ring-blue-400' : ''
                    }`}
                  >
                    <Link 
                      to={`/gallery/${gallery._id}`}
                      className="block p-4 border-b border-gray-200 hover:bg-gray-50"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">
                        {gallery.name}
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          ({gallery.images?.length || 0} images)
                        </span>
                      </h3>
                    </Link>
                    
                    <div className="p-4">
                      {gallery.images && gallery.images.length > 0 ? (
                        <div className="space-y-2">
                          {gallery.images.map((image, index) => (
                            <Draggable key={image._id} draggableId={image._id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-3 bg-gray-50 rounded-md flex items-center justify-between ${
                                    snapshot.isDragging ? 'shadow-lg' : ''
                                  }`}
                                >
                                  <span className="text-sm truncate">{image.originalName}</span>
                                  <img
                                    src={`${config.apiUrl}/${image.thumbnailPath}`}
                                    alt=""
                                    className="w-10 h-10 object-cover rounded"
                                    crossOrigin="anonymous"
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          No images in this gallery
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>

          {/* Unassigned Images */}
          <Droppable droppableId="unassigned">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="mt-8"
              >
                <h2 className="text-xl font-bold mb-4">Unassigned Images</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleries
                    .filter(gallery => !gallery.images || gallery.images.length === 0)
                    .map((image, index) => (
                      <Draggable key={image._id} draggableId={image._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white rounded-lg shadow-sm p-4 ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                          >
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={`${config.apiUrl}/${image.thumbnailPath}`}
                                alt={image.originalName}
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                              />
                            </div>
                            <p className="mt-2 text-sm truncate">{image.originalName}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Upload Modal */}
        {showUploader && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Upload Image</h2>
                <button
                  onClick={() => setShowUploader(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <ImageUploader
                galleries={galleries}
                onUploadSuccess={async () => {
                  await fetchData();
                  setShowUploader(false);
                  toast.success('Image uploaded successfully');
                }}
              />
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default GalleryList;