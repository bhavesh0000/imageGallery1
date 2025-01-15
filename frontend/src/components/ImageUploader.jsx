import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import axios from 'axios';

const ImageUploader = ({ galleries, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageDetails, setImageDetails] = useState({
    name: '',
    description: '',
    galleryId: '',
  });

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setImageDetails(prev => ({
        ...prev,
        name: file.name.split('.')[0]
      }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.gif']
    },
    multiple: false
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image');
      return;
    }

    const formData = new FormData();
    // Important: Make sure the field name matches what multer expects
    formData.append('image', selectedFile);
    formData.append('name', imageDetails.name);
    formData.append('description', imageDetails.description);
    if (imageDetails.galleryId) {
      formData.append('galleryId', imageDetails.galleryId);
    }

    setUploading(true);
    try {
      const response = await axios.post('http://localhost:3004/api/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Image uploaded successfully');
        onUploadSuccess(response.data.data);
        // Reset form
        setSelectedFile(null);
        setImageDetails({
          name: '',
          description: '',
          galleryId: '',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-4 rounded-lg text-center cursor-pointer
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        >
          <input {...getInputProps()} />
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive ? 'Drop the image here' : 'Drag & drop an image, or click to select'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="h-20 w-20 object-cover rounded"
            />
            <div className="flex-1">
              <input
                type="text"
                value={imageDetails.name}
                onChange={(e) => setImageDetails(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Image name"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <textarea
            value={imageDetails.description}
            onChange={(e) => setImageDetails(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description (optional)"
            className="w-full p-2 border rounded"
          />

          <select
            value={imageDetails.galleryId}
            onChange={(e) => setImageDetails(prev => ({ ...prev, galleryId: e.target.value }))}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Gallery (optional)</option>
            {galleries.map(gallery => (
              <option key={gallery._id} value={gallery._id}>
                {gallery.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setSelectedFile(null);
                setImageDetails({ name: '', description: '', galleryId: '' });
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`px-4 py-2 text-white rounded ${
                uploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;