import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Camera,
  ImagePlus,
  X,
  Upload,
  RefreshCw,
} from 'lucide-react';

const ProductReviewPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState('');

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    setStream(null);
    setCameraOpen(false);
  };

  // Open real camera
  const openCamera = async () => {
    try {
      setCameraError('');

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(
          'Camera is not supported in this browser.'
        );
        return;
      }

      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: 'environment',
            },
          },
          audio: false,
        });

      setStream(mediaStream);
      setCameraOpen(true);
    } catch (error) {
      console.error('Camera error:', error);

      if (error.name === 'NotAllowedError') {
        setCameraError(
          'Camera permission denied. Please allow camera access in your browser.'
        );
      } else if (error.name === 'NotFoundError') {
        setCameraError(
          'No camera was found on this device.'
        );
      } else {
        setCameraError(
          'Unable to access camera. Please try again.'
        );
      }
    }
  };

  // Attach stream to video
  useEffect(() => {
    if (cameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [cameraOpen, stream]);

  // Cleanup camera when leaving page
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [stream]);

  // Capture photo from camera
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    context.drawImage(
      video,
      0,
      0,
      width,
      height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File(
          [blob],
          `review-camera-${Date.now()}.jpg`,
          {
            type: 'image/jpeg',
          }
        );

        const imageUrl =
          URL.createObjectURL(file);

        setSelectedImage({
          file,
          preview: imageUrl,
        });

        stopCamera();
      },
      'image/jpeg',
      0.9
    );
  };

  // Select image from gallery
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image.');
      return;
    }

    const imageUrl =
      URL.createObjectURL(file);

    setSelectedImage({
      file,
      preview: imageUrl,
    });
  };

  // Open gallery
  const openGallery = () => {
    fileInputRef.current?.click();
  };

  // Remove selected image
  const removeImage = () => {
    if (selectedImage?.preview) {
      URL.revokeObjectURL(
        selectedImage.preview
      );
    }

    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit review
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
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setRating(star)
                    }
                    className={`text-3xl transition-transform hover:scale-110 ${
                      star <= rating
                        ? 'text-[#C9A452]'
                        : 'text-gray-300'
                    }`}
                    aria-label={`Rate ${star} stars`}
                  >
                    ★
                  </button>
                )
              )}
            </div>
          </div>

          {/* Review */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-[#123D2A] mb-2">
              Your Review
            </label>

            <textarea
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
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

            {/* Gallery Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Hidden Canvas */}
            <canvas
              ref={canvasRef}
              className="hidden"
            />

            {/* CAMERA PREVIEW */}
            {cameraOpen && (
              <div className="mb-4 border border-[#EAE1D2] rounded-xl p-3">

                <div className="overflow-hidden rounded-xl bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-72 object-cover"
                  />
                </div>

                <div className="flex gap-3 mt-4">

                  <button
                    type="button"
                    onClick={stopCamera}
                    className="flex-1 border border-[#123D2A] text-[#123D2A] py-3 rounded-full font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="flex-1 bg-[#123D2A] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />

                    Capture Photo
                  </button>

                </div>

              </div>
            )}

            {/* CAMERA ERROR */}
            {cameraError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {cameraError}
              </div>
            )}

            {/* SELECT OPTIONS */}
            {!selectedImage && !cameraOpen && (
              <div className="flex flex-col sm:flex-row gap-3">

                {/* Take Photo */}
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

                {/* Choose Photo */}
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
            )}

            {/* IMAGE PREVIEW */}
            {selectedImage && (
              <div className="relative border border-[#EAE1D2] rounded-xl overflow-hidden p-2">

                <img
                  src={selectedImage.preview}
                  alt="Review preview"
                  className="w-full h-64 object-cover rounded-lg"
                />

                {/* Remove */}
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md"
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

                <button
                  type="button"
                  onClick={removeImage}
                  className="mt-3 w-full border border-[#123D2A] text-[#123D2A] py-2 rounded-full text-sm font-bold flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />

                  Choose Another Photo
                </button>

              </div>
            )}

          </div>

          {/* Buttons */}
          <div className="flex gap-3">

            <button
              type="button"
              onClick={() => {
                stopCamera();
                navigate('/orders');
              }}
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