import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';
import adminApi from '../../services/adminApi';
import { ArrowLeft, Save } from 'lucide-react';

const AdminEditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
    isActive: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await adminApi.get('/categories');
        if (catRes.success) setCategories(catRes.data);

        const prodRes = await adminApi.get(`/products/${id}`);
        if (prodRes.success && prodRes.data) {
          const p = prodRes.data;
          setFormData({
            name: p.name,
            category: p.category?._id || p.category,
            brand: p.brand || 'AyurvedaMart',
            price: p.price,
            discountPrice: p.discountPrice || '',
            sku: p.sku,
            stock: p.stock,
            weight: p.weight || '100g',
            image: p.images && p.images.length > 0 ? p.images[0] : '',
            shortDescription: p.shortDescription || '',
            description: p.description,
            ingredients: Array.isArray(p.ingredients) ? p.ingredients.join(', ') : '',
            benefits: Array.isArray(p.benefits) ? p.benefits.join(', ') : '',
            usage: p.usage || '',
            storageInstructions: p.storageInstructions || '',
            featured: Boolean(p.featured),
            isActive: Boolean(p.isActive),
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await adminApi.put(`/products/${id}`, {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
        stock: Number(formData.stock),
        images: [formData.image],
        ingredients: formData.ingredients ? formData.ingredients.split(',').map(i => i.trim()) : [],
        benefits: formData.benefits ? formData.benefits.split(',').map(b => b.trim()) : [],
      });

      if (res.success) {
        alert('Product updated successfully!');
        navigate('/admin/products');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-xs font-bold text-[#123D2A]">Loading product details...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F7F2E8]/40">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-[#FFFDF8] border border-[#EAE1D2]">
              <ArrowLeft className="w-4 h-4 text-[#123D2A]" />
            </button>
            <h2 className="font-serif font-bold text-2xl text-[#123D2A]">Edit Product</h2>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#FFFDF8] p-8 rounded-3xl border border-[#EAE1D2] shadow-xs space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Category</label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none font-bold"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Full Description</label>
              <textarea
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-[#123D2A] text-white text-xs font-bold tracking-widest rounded-full hover:bg-[#0B2D1E] shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#C49A52]" />
              {submitting ? 'UPDATING...' : 'UPDATE PRODUCT'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AdminEditProductPage;
