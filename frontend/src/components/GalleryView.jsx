import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { config } from '../config/config';

const GalleryView = () => {
  const { id } = useParams();
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/api/galleries/${id}`);
        if (response.data.success) {
          setGallery(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!gallery) {
    return <div>Gallery not found</div>;
  }

  return (
    <>
 
      <section className="about_gall_sec sec_padd">
        <div>
          <div className="row px-xl-5">
            <div className="col-md-12 text-center">
              <h2 className="common_head">Transforming Ideas into Images</h2>
              <p className="sub_head">
                {gallery.description || 'Explore our collection of carefully curated images that showcase our vision and creativity.'}
              </p>
            </div>

            <div className="col-md-12">
              <div className="ab_gall_mesn">
                {gallery.images?.map((image) => (
                  <div 
                    key={image._id} 
                    className="ab_gall_block"
                    onClick={() => setSelectedImage(image)}
                    
                  >
                    <figure className="mb-0 img_hover">
                      <img
                        src={`${config.apiUrl}/${image.path}`}
                        alt={image.originalName}
                        loading="lazy"
                        crossOrigin="anonymous"
                      />
                    </figure>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="max-w-7xl w-full h-full p-4 flex flex-col items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={`${config.apiUrl}/${selectedImage.path}`}
              alt={selectedImage.originalName}
              className="max-h-[80vh] max-w-full object-contain rounded-lg"
              crossOrigin="anonymous"
            />
            <div className="mt-4 text-white text-center">
              <h3 className="text-xl font-medium">{selectedImage.originalName}</h3>
              {selectedImage.description && (
                <p className="mt-2 text-gray-300">{selectedImage.description}</p>
              )}
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="mt-4 px-4 py-2 bg-white text-black rounded-full hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryView;