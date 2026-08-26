import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';
import adminApi from '../../services/adminApi';
import { ArrowLeft, Save } from 'lucide-react';

const AdminAddProductPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: 'AyurvedaMart',
    price: '',
    discountPrice: '',
    sku: '',
    stock: '25',
    weight: '100g',
    image: '',
    shortDescription: '',
    description: '',
    ingredients: '',
    benefits: '',
    usage: 'Take as directed on package or consult an Ayurvedic practitioner.',
    storageInstructions: 'Store in a cool, dry place away from direct sunlight.',
    featured: false,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await adminApi.get('/categories');
        if (res.success && res.data.length > 0) {
          setCategories(res.data);
          setFormData((prev) => ({ ...prev, category: res.data[0]._id }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price || !formData.sku || !formData.description) {
      return alert('Please fill in all required fields (Name, Category, Price, SKU, Description)');
    }

    try {
      setLoading(true);
      const res = await adminApi.post('/products', {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
        images: [formData.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'],
        description: formData.description,
        shortDescription: formData.shortDescription,
        ingredients: formData.ingredients ? formData.ingredients.split(',').map(i => i.trim()) : [],
        benefits: formData.benefits ? formData.benefits.split(',').map(b => b.trim()) : [],
        usage: formData.usage,
        storageInstructions: formData.storageInstructions,
        weight: formData.weight,
        stock: Number(formData.stock),
        sku: formData.sku,
        featured: formData.featured,
      });

      if (res.success) {
        alert('🎉 Product added successfully to MongoDB!');
        navigate('/admin/products');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            <div>
              <h2 className="font-serif font-bold text-2xl text-[#123D2A]">Add New Product</h2>
              <p className="text-xs text-[#7A6248]">Create new Ayurvedic formulation in MongoDB catalog.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#FFFDF8] p-8 rounded-3xl border border-[#EAE1D2] shadow-xs space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Organic Herbal Kadha"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Category *</label>
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
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  required
                  placeholder="299"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Discount Price (₹)</label>
                <input
                  type="number"
                  name="discountPrice"
                  placeholder="249"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">SKU Code *</label>
                <input
                  type="text"
                  name="sku"
                  required
                  placeholder="AVM-KAD-009"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Stock Quantity *</label>
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
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={handleChange}
                className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Ingredients (comma separated)</label>
                <input
                  type="text"
                  name="ingredients"
                  placeholder="Tulsi, Ginger, Cinnamon"
                  value={formData.ingredients}
                  onChange={handleChange}
                  className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Key Benefits (comma separated)</label>
                <input
                  type="text"
                  name="benefits"
                  placeholder="Boosts Immunity, Improves Digestion"
                  value={formData.benefits}
                  onChange={handleChange}
                  className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Full Description *</label>
              <textarea
                name="description"
                rows={4}
                required
                placeholder="Detailed Ayurvedic description..."
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-[#123D2A]"
              />
              <label htmlFor="featured" className="text-xs font-bold text-[#123D2A]">Feature on Homepage New Arrivals</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#123D2A] text-white text-xs font-bold tracking-widest rounded-full hover:bg-[#0B2D1E] shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#C49A52]" />
              {loading ? 'SAVING PRODUCT...' : 'SAVE & PUBLISH PRODUCT'}
            </button>

          </form>

        </main>
      </div>
    </div>
  );
};

export default AdminAddProductPage;
