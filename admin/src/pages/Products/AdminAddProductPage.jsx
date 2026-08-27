import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';
import adminApi from '../../services/adminApi';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  PackagePlus,
} from 'lucide-react';

const AdminAddProductPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: 'AyurvedaMart',
    price: '',
    discountPrice: '',
    sku: '',
    stock: '',
    weight: '100g',
    image: '',
    shortDescription: '',
    description: '',
    ingredients: '',
    benefits: '',
    usage: '',
    storageInstructions: '',
    featured: false,
  });

  // ============================================================
  // FETCH CATEGORIES
  // ============================================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await adminApi.get('/categories');

        if (res.success) {
          setCategories(res.data);

          // Automatically select first category
          if (res.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              category: res.data[0]._id,
            }));
          }
        }
      } catch (error) {
        console.error(error);
        alert('Failed to load categories.');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // ============================================================
  // HANDLE FORM CHANGE
  // ============================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }));
  };

  // ============================================================
  // CLOUDINARY IMAGE UPLOAD
  // ============================================================

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        'Image size must be less than 5MB.'
      );
      return;
    }

    try {
      setUploadingImage(true);

      const cloudName =
        import.meta.env
          .VITE_CLOUDINARY_CLOUD_NAME;

      const uploadPreset =
        import.meta.env
          .VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error(
          'Cloudinary configuration is missing.'
        );
      }

      const uploadData = new FormData();

      uploadData.append('file', file);

      uploadData.append(
        'upload_preset',
        uploadPreset
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: uploadData,
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
          'Image upload failed.'
        );
      }

      setFormData((prev) => ({
        ...prev,
        image: data.secure_url,
      }));

      setImagePreview(
        data.secure_url
      );

      console.log(
        'Cloudinary Product Image:',
        data.secure_url
      );

    } catch (error) {

      console.error(
        'Cloudinary upload error:',
        error
      );

      alert(
        error.message ||
        'Failed to upload image.'
      );

    } finally {

      setUploadingImage(false);

      // Allow same file selection again
      e.target.value = '';
    }
  };

  // ============================================================
  // REMOVE IMAGE
  // ============================================================

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: '',
    }));

    setImagePreview('');
  };

  // ============================================================
  // CREATE PRODUCT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadingImage) {
      alert(
        'Please wait until image upload is complete.'
      );
      return;
    }

    if (!formData.category) {
      alert(
        'Please select a category.'
      );
      return;
    }

    if (
      !formData.name ||
      !formData.price ||
      !formData.description ||
      !formData.sku
    ) {
      alert(
        'Please fill all required fields.'
      );
      return;
    }

    try {

      setSubmitting(true);

      const productData = {
        name:
          formData.name.trim(),

        category:
          formData.category,

        brand:
          formData.brand.trim() ||
          'AyurvedaMart',

        price:
          Number(formData.price),

        discountPrice:
          formData.discountPrice
            ? Number(
              formData.discountPrice
            )
            : 0,

        sku:
          formData.sku.trim(),

        stock:
          formData.stock
            ? Number(formData.stock)
            : 0,

        weight:
          formData.weight.trim() ||
          '100g',

        // IMPORTANT
        // Backend expects images ARRAY
        images:
          formData.image
            ? [formData.image]
            : [],

        shortDescription:
          formData.shortDescription.trim(),

        description:
          formData.description.trim(),

        ingredients:
          formData.ingredients
            ? formData.ingredients
              .split(',')
              .map((item) =>
                item.trim()
              )
              .filter(Boolean)
            : [],

        benefits:
          formData.benefits
            ? formData.benefits
              .split(',')
              .map((item) =>
                item.trim()
              )
              .filter(Boolean)
            : [],

        usage:
          formData.usage.trim(),

        storageInstructions:
          formData.storageInstructions.trim(),

        featured:
          formData.featured,
      };

      console.log(
        'Creating Product:',
        productData
      );

      const res =
        await adminApi.post(
          '/products',
          productData
        );

      if (res.success) {

        alert(
          'Product created successfully!'
        );

        navigate(
          '/admin/products'
        );
      }

    } catch (error) {

      console.error(
        'Create product error:',
        error
      );

      alert(
        error.message ||
        'Failed to create product.'
      );

    } finally {

      setSubmitting(false);
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

          {/* HEADER */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                navigate(
                  '/admin/products'
                )
              }
              className="p-2 rounded-full bg-[#FFFDF8] border border-[#EAE1D2] hover:bg-[#F7F2E8]"
            >
              <ArrowLeft className="w-5 h-5 text-[#123D2A]" />
            </button>

            <div>
              <h2 className="font-serif font-bold text-2xl text-[#123D2A]">
                Add New Product
              </h2>

              <p className="text-xs text-[#7A6248]">
                Add a new Ayurvedic product
                to your store.
              </p>
            </div>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="bg-[#FFFDF8] p-6 md:p-8 rounded-3xl border border-[#EAE1D2] shadow-xs space-y-6"
          >

            {/* BASIC DETAILS */}

            <div>

              <h3 className="font-serif font-bold text-lg text-[#123D2A] mb-4">
                Product Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* PRODUCT NAME */}

                <div>

                  <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                    Product Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 text-sm bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#123D2A]"
                  />

                </div>

                {/* CATEGORY */}

                <div>

                  <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                    Category *
                  </label>

                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    disabled={loadingCategories}
                    className="w-full p-3 text-sm bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                  >

                    <option value="">
                      Select Category
                    </option>

                    {categories.map(
                      (category) => (

                        <option
                          key={
                            category._id
                          }
                          value={
                            category._id
                          }
                        >
                          {
                            category.name
                          }
                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* BRAND */}

                <div>

                  <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                    Brand
                  </label>

                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full p-3 text-sm bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                  />

                </div>

                {/* SKU */}

                <div>

                  <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                    SKU *
                  </label>

                  <input
                    type="text"
                    name="sku"
                    required
                    placeholder="e.g. AYU-001"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full p-3 text-sm bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                  />

                </div>

              </div>

            </div>

            {/* PRICE */}

            <div>

              <h3 className="font-serif font-bold text-lg text-[#123D2A] mb-4">
                Pricing & Inventory
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* PRICE */}

                <div>

                  <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                    Price (₹) *
                  </label>

                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    placeholder="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-3 text-sm bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                  />

                </div>

                {/* DISCOUNT */}

                <div>

                  <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                    Discount Price
                  </label>

                  <input
                    type="number"
                    name="discountPrice"
                    min="0"
                    placeholder="Optional"
                    value={
                      formData.discountPrice
                    }
                    onChange={handleChange}
                    className="w-full p-3 text-sm bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                  />

                </div>

                {/* STOCK */}

                <div>

                  <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    min="0"
                    placeholder="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full p-3 text-sm bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                  />

                </div>

                {/* WEIGHT */}

                <div>

                  <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">
                    Weight
                  </label>

                  <input
                    type="text"
                    name="weight"
                    placeholder="100g"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full p-3 text-sm bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                  />

                </div>

              </div>

            </div>

            {/* IMAGE UPLOAD */}

            <div>

              <h3 className="font-serif font-bold text-lg text-[#123D2A] mb-4">
                Product Image
              </h3>

              {!imagePreview ? (

                <label
                  htmlFor="product-image"
                  className="w-full min-h-[220px] border-2 border-dashed border-[#C49A52]/50 rounded-2xl bg-[#F7F2E8] flex flex-col items-center justify-center cursor-pointer hover:border-[#123D2A] transition"
                >

                  <Upload className="w-10 h-10 text-[#123D2A] mb-3" />

                  <span className="text-sm font-bold text-[#123D2A]">

                    {uploadingImage
                      ? 'UPLOADING IMAGE...'
                      : 'CLICK TO UPLOAD PRODUCT IMAGE'}

                  </span>

                  <span className="text-xs text-[#7A6248] mt-2">

                    JPG, PNG, WEBP • Maximum 5MB

                  </span>

                  <input
                    id="product-image"
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={
                      handleImageUpload
                    }
                    className="hidden"
                  />

                </label>

              ) : (

                <div className="relative max-w-md">

                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-64 object-cover rounded-2xl border border-[#EAE1D2]"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
                  >

                    <X className="w-5 h-5" />

                  </button>

                </div>

              )}

            </div>

            {/* SHORT DESCRIPTION */}

            <div>

              <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">

                Short Description

              </label>

              <input
                type="text"
                name="shortDescription"
                placeholder="Short product description"
                value={
                  formData.shortDescription
                }
                onChange={handleChange}
                className="w-full p-3 text-sm bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
              />

            </div>

            {/* DESCRIPTION */}

            <div>

              <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">

                Full Description *

              </label>

              <textarea
                name="description"
                required
                rows="5"
                placeholder="Write complete product description..."
                value={
                  formData.description
                }
                onChange={handleChange}
                className="w-full p-3 text-sm bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
              />

            </div>

            {/* INGREDIENTS */}

            <div>

              <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">

                Ingredients

              </label>

              <input
                type="text"
                name="ingredients"
                placeholder="e.g. Ashwagandha, Tulsi, Ginger"
                value={
                  formData.ingredients
                }
                onChange={handleChange}
                className="w-full p-3 text-sm bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
              />

            </div>

            {/* BENEFITS */}

            <div>

              <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">

                Benefits

              </label>

              <input
                type="text"
                name="benefits"
                placeholder="e.g. Supports immunity, Improves wellness"
                value={
                  formData.benefits
                }
                onChange={handleChange}
                className="w-full p-3 text-sm bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
              />

            </div>

            {/* USAGE */}

            <div>

              <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">

                Usage Instructions

              </label>

              <textarea
                name="usage"
                rows="3"
                placeholder="How should the customer use this product?"
                value={
                  formData.usage
                }
                onChange={handleChange}
                className="w-full p-3 text-sm bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
              />

            </div>

            {/* STORAGE */}

            <div>

              <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">

                Storage Instructions

              </label>

              <textarea
                name="storageInstructions"
                rows="3"
                placeholder="How should this product be stored?"
                value={
                  formData.storageInstructions
                }
                onChange={handleChange}
                className="w-full p-3 text-sm bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
              />

            </div>

            {/* FEATURED */}

            <label className="flex items-center gap-3 cursor-pointer">

              <input
                type="checkbox"
                name="featured"
                checked={
                  formData.featured
                }
                onChange={
                  handleChange
                }
                className="w-4 h-4"
              />

              <span className="text-sm font-bold text-[#123D2A]">

                Featured Product

              </span>

            </label>

            {/* BUTTONS */}

            <div className="flex flex-wrap gap-3 pt-4 border-t border-[#EAE1D2]">

              <button
                type="submit"
                disabled={
                  submitting ||
                  uploadingImage
                }
                className="px-7 py-3 bg-[#123D2A] text-white text-xs font-bold tracking-wider rounded-full hover:bg-[#0B2D1E] disabled:opacity-50 flex items-center gap-2"
              >

                {submitting ? (

                  'CREATING PRODUCT...'

                ) : (

                  <>
                    <Save className="w-4 h-4 text-[#C49A52]" />

                    CREATE PRODUCT
                  </>

                )}

              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/admin/products'
                  )
                }
                className="px-7 py-3 bg-[#F7F2E8] text-[#123D2A] text-xs font-bold rounded-full border border-[#EAE1D2]"
              >

                CANCEL

              </button>

            </div>

          </form>

        </main>

      </div>

    </div>
  );
};

export default AdminAddProductPage;