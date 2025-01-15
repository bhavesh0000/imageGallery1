import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PlusIcon, PhotoIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import ImageUploader from './ImageUploader';
import { config } from '../config/config';

// CSS for masonry layout
const masonryStyles = `
.gallery-masonry {
  columns: 4 250px;
  column-gap: 1rem;
}

.gallery-item {
  break-inside: avoid;
  margin-bottom: 1rem;
}

@media (max-width: 1024px) {
  .gallery-masonry {
    columns: 3 250px;
  }
}

@media (max-width: 768px) {
  .gallery-masonry {
    columns: 2 250px;
  }
}

@media (max-width: 480px) {
  .gallery-masonry {
    columns: 1 250px;
  }
}
`;

const GalleryList = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [showNewGalleryModal, setShowNewGalleryModal] = useState(false);
  const [newGalleryName, setNewGalleryName] = useState('');

  useEffect(() => {
    // Add masonry styles to head
    const styleSheet = document.createElement("style");
    styleSheet.innerText = masonryStyles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

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

  const handleCreateGallery = async () => {
    if (!newGalleryName.trim()) {
      toast.error('Gallery name is required');
      return;
    }

    try {
      await axios.post(`${config.apiUrl}/api/galleries`, {
        name: newGalleryName.trim()
      });
      await fetchData();
      setNewGalleryName('');
      setShowNewGalleryModal(false);
      toast.success('Gallery created successfully');
    } catch (error) {
      toast.error('Failed to create gallery');
    }
  };

  const handleDeleteGallery = async (e, galleryId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this gallery? Images will be moved to unassigned.')) {
      return;
    }

    try {
      await axios.delete(`${config.apiUrl}/api/galleries/${galleryId}`);
      await fetchData();
      toast.success('Gallery deleted successfully');
    } catch (error) {
      toast.error('Failed to delete gallery');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Galleries</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowNewGalleryModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Gallery
              </button>
              <button
                onClick={() => setShowUploader(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PhotoIcon className="h-5 w-5 mr-2" />
                Upload Image
              </button>
            </div>
          </div>

          {/* Gallery Masonry Grid */}
          <div className="gallery-masonry">
            {galleries.map(gallery => (
              <Droppable key={gallery._id} droppableId={gallery._id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="gallery-item"
                  >
                    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                      snapshot.isDraggingOver ? 'ring-2 ring-blue-400' : ''
                    }`}>
                      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <Link to={`/gallery/${gallery._id}`} className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {gallery.name}
                            <span className="ml-2 text-sm font-normal text-gray-500">
                              ({gallery.images?.length || 0} images)
                            </span>
                          </h3>
                        </Link>
                        <button
                          onClick={(e) => handleDeleteGallery(e, gallery._id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>

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
                                    className={`p-2 bg-gray-50 rounded-md text-sm ${
                                      snapshot.isDragging ? 'ring-2 ring-blue-400 shadow-lg' : ''
                                    }`}
                                  >
                                    {image.originalName}
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
                  </div>
                )}
              </Droppable>
            ))}
          </div>

          {/* Unassigned Images Section */}
          <div className="mt-8">
            <Droppable droppableId="unassigned">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <h2 className="text-xl font-bold mb-4">Unassigned Images</h2>
                  <div className="space-y-2">
                    {galleries
                      .filter(gallery => !gallery.images || gallery.images.length === 0)
                      .map((image, index) => (
                        <Draggable key={image._id} draggableId={image._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-2 bg-gray-50 rounded-md text-sm ${
                                snapshot.isDragging ? 'ring-2 ring-blue-400 shadow-lg' : ''
                              }`}
                            >
                              {image.originalName}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        </div>

        {/* Modals */}
        {showNewGalleryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Create New Gallery</h2>
                <button
                  onClick={() => setShowNewGalleryModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <input
                type="text"
                value={newGalleryName}
                onChange={(e) => setNewGalleryName(e.target.value)}
                placeholder="Gallery Name"
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowNewGalleryModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGallery}
                  className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded"
                >
                  Create Gallery
                </button>
              </div>
            </div>
          </div>
        )}

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