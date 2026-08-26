import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';
import adminApi from '../../services/adminApi';
import {
  Plus,
  Trash2,
  FolderTree,
  Upload,
  X,
} from 'lucide-react';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // FETCH CATEGORIES
  // ============================================================

  const fetchCategories = async () => {
    try {
      const res = await adminApi.get('/categories');

      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ============================================================
  // CLOUDINARY IMAGE UPLOAD
  // ============================================================

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check image type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      e.target.value = '';
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB.');
      e.target.value = '';
      return;
    }

    try {
      setUploadingImage(true);

      const cloudName =
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

      const uploadPreset =
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      // Check Cloudinary configuration
      if (!cloudName || !uploadPreset) {
        throw new Error(
          'Cloudinary configuration is missing. Please check Vercel environment variables.'
        );
      }

      const uploadData = new FormData();

      uploadData.append('file', file);
      uploadData.append('upload_preset', uploadPreset);

      // Upload directly to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: uploadData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
            'Image upload failed.'
        );
      }

      // Save Cloudinary URL
      setImage(data.secure_url);

      // Show preview
      setImagePreview(data.secure_url);

      console.log(
        'Category Cloudinary Image URL:',
        data.secure_url
      );
    } catch (error) {
      console.error(
        'Cloudinary category image upload error:',
        error
      );

      alert(
        error.message ||
          'Failed to upload image. Please try again.'
      );

      setImage('');
      setImagePreview('');
    } finally {
      setUploadingImage(false);

      // Allow selecting same image again
      e.target.value = '';
    }
  };

  // ============================================================
  // REMOVE IMAGE
  // ============================================================

  const removeImage = () => {
    setImage('');
    setImagePreview('');
  };

  // ============================================================
  // CREATE CATEGORY
  // ============================================================

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return alert('Category name required');
    }

    if (uploadingImage) {
      return alert(
        'Please wait until the image upload is complete.'
      );
    }

    try {
      const res = await adminApi.post('/categories', {
        name: name.trim(),
        description: description.trim(),
        image,
      });

      if (res.success) {
        setCategories((prev) => [
          ...prev,
          res.data,
        ]);

        setName('');
        setDescription('');
        setImage('');
        setImagePreview('');

        alert('Category added successfully!');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // ============================================================
  // DELETE CATEGORY
  // ============================================================

  const handleDelete = async (id, catName) => {
    if (
      window.confirm(
        `Delete category "${catName}"?`
      )
    ) {
      try {
        const res = await adminApi.delete(
          `/categories/${id}`
        );

        if (res.success) {
          setCategories((prev) =>
            prev.filter(
              (c) => c._id !== id
            )
          );
        }
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="flex min-h-screen bg-[#F7F2E8]/40">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">

          {/* PAGE HEADER */}

          <div>
            <h2 className="font-serif font-bold text-2xl text-[#123D2A]">
              Category Management
            </h2>

            <p className="text-xs text-[#7A6248]">
              Control product categories displayed
              across the store.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* ==================================================
                CREATE CATEGORY FORM
            ================================================== */}

            <form
              onSubmit={handleAddCategory}
              className="lg:col-span-4 bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] space-y-4 shadow-xs"
            >

              <h3 className="font-serif font-bold text-lg text-[#123D2A] flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#789B72]" />
                Add New Category
              </h3>

              {/* CATEGORY NAME */}

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                  Category Name *
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. Skin Care"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                  Description
                </label>

                <input
                  type="text"
                  placeholder="Brief description..."
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                />
              </div>

              {/* ==================================================
                  CATEGORY IMAGE UPLOAD
              ================================================== */}

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-2">
                  Category Image
                </label>

                {!imagePreview ? (
                  <label
                    htmlFor="category-image"
                    className="w-full min-h-[170px] border-2 border-dashed border-[#C49A52]/50 rounded-2xl bg-[#F7F2E8] flex flex-col items-center justify-center cursor-pointer hover:border-[#123D2A] transition"
                  >

                    <Upload className="w-8 h-8 text-[#123D2A] mb-3" />

                    <span className="text-sm font-bold text-[#123D2A] text-center">
                      {uploadingImage
                        ? 'UPLOADING IMAGE...'
                        : 'CLICK TO SELECT IMAGE'}
                    </span>

                    <span className="text-xs text-[#7A6248] mt-1">
                      JPG, PNG, WEBP • Maximum 5MB
                    </span>

                    <input
                      id="category-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />

                  </label>
                ) : (
                  <div className="relative w-full">

                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="w-full h-44 object-cover rounded-2xl border border-[#EAE1D2]"
                    />

                    {/* REMOVE IMAGE */}

                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* UPLOAD SUCCESS */}

                    <div className="mt-2 px-3 py-2 bg-[#F7F2E8] rounded-xl">

                      <p className="text-[10px] text-[#7A6248]">
                        Image uploaded successfully
                      </p>

                      <p className="text-[10px] text-[#123D2A] break-all font-medium">
                        {image}
                      </p>

                    </div>

                  </div>
                )}
              </div>

              {/* CREATE CATEGORY */}

              <button
                type="submit"
                disabled={uploadingImage}
                className="w-full py-3 bg-[#123D2A] text-white text-xs font-bold rounded-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >

                <Plus className="w-4 h-4 text-[#C49A52]" />

                {uploadingImage
                  ? 'UPLOADING IMAGE...'
                  : 'CREATE CATEGORY'}

              </button>

            </form>

            {/* ==================================================
                EXISTING CATEGORIES
            ================================================== */}

            <div className="lg:col-span-8 bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] shadow-xs">

              <h3 className="font-serif font-bold text-lg text-[#123D2A] mb-4">
                Existing Categories ({categories.length})
              </h3>

              {loading ? (
                <p className="text-xs font-bold text-[#123D2A]">
                  Loading categories...
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {categories.map((cat) => (

                    <div
                      key={cat._id}
                      className="p-4 bg-[#F7F2E8]/60 rounded-xl border border-[#EAE1D2] flex items-center justify-between"
                    >

                      <div className="flex items-center space-x-3">

                        <img
                          src={
                            cat.image ||
                            'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'
                          }
                          alt={cat.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />

                        <div>

                          <h4 className="font-bold text-xs text-[#123D2A]">
                            {cat.name}
                          </h4>

                          <span className="text-[10px] text-[#7A6248]">
                            slug: {cat.slug}
                          </span>

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            cat._id,
                            cat.name
                          )
                        }
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  ))}

                </div>
              )}

            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;