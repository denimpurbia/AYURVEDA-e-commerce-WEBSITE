import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Camera,
  ImagePlus,
  X,
  Upload,
} from 'lucide-react';

const ProductReviewPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Select image from gallery
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image.');
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage({
      file,
      preview: imageUrl,
    });
  };

  // Open gallery
  const openGallery = () => {
    fileInputRef.current?.click();
  };

  // Open camera
  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  // Remove selected image
  const removeImage = () => {
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }

    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert('Please write your review.');
      return;
    }

    console.log({
      productId,
      rating,
      comment,
      image: selectedImage?.file || null,
    });

    alert('Review submitted successfully!');
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white border border-[#EAE1D2] rounded-2xl p-6 shadow-sm">

        {/* Heading */}
        <h1 className="text-3xl font-serif font-bold text-[#123D2A] mb-2">
          Write a Review
        </h1>

        <p className="text-sm text-[#7A6248] mb-6">
          Share your experience with this product.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-[#123D2A] mb-3">
              Your Rating
            </label>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-transform hover:scale-110 ${
                    star <= rating
                      ? 'text-[#C9A452]'
                      : 'text-gray-300'
                  }`}
                  aria-label={`Rate ${star} stars`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Review */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-[#123D2A] mb-2">
              Your Review
            </label>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows="6"
              placeholder="Tell us about your experience..."
              className="w-full border border-[#EAE1D2] rounded-xl p-4 outline-none resize-none focus:ring-2 focus:ring-[#123D2A]"
            />
          </div>

          {/* Add Photo */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-[#123D2A] mb-3">
              Add a Photo
              <span className="ml-2 font-normal text-[#7A6248]">
                (Optional)
              </span>
            </label>

            {/* Hidden Gallery Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Hidden Camera Input */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="hidden"
            />

            {!selectedImage ? (
              <div className="flex flex-col sm:flex-row gap-3">

                {/* Camera Button */}
                <button
                  type="button"
                  onClick={openCamera}
                  className="flex-1 border-2 border-dashed border-[#C9A452] rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-[#123D2A] hover:bg-[#FFF9ED] transition"
                >
                  <div className="w-11 h-11 rounded-full bg-[#123D2A] text-white flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>

                  <span className="font-bold text-sm">
                    Take Photo
                  </span>

                  <span className="text-xs text-[#7A6248]">
                    Use Camera
                  </span>
                </button>

                {/* Gallery Button */}
                <button
                  type="button"
                  onClick={openGallery}
                  className="flex-1 border-2 border-dashed border-[#EAE1D2] rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-[#123D2A] hover:bg-[#F7F2E8] transition"
                >
                  <div className="w-11 h-11 rounded-full bg-[#F7F2E8] text-[#123D2A] flex items-center justify-center">
                    <ImagePlus className="w-5 h-5" />
                  </div>

                  <span className="font-bold text-sm">
                    Choose Photo
                  </span>

                  <span className="text-xs text-[#7A6248]">
                    From Gallery
                  </span>
                </button>

              </div>
            ) : (

              /* Image Preview */
              <div className="relative border border-[#EAE1D2] rounded-xl overflow-hidden p-2">

                <img
                  src={selectedImage.preview}
                  alt="Review preview"
                  className="w-full h-64 object-cover rounded-lg"
                />

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:scale-105 transition"
                  aria-label="Remove image"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center gap-2 mt-3 text-sm text-[#123D2A]">
                  <Upload className="w-4 h-4" />

                  <span className="font-medium">
                    Photo selected successfully
                  </span>
                </div>

              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">

            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="flex-1 border border-[#123D2A] text-[#123D2A] py-3 rounded-full font-bold hover:bg-[#F7F2E8] transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-[#123D2A] text-white py-3 rounded-full font-bold hover:bg-[#0D2E20] transition"
            >
              Submit Review
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default ProductReviewPage;