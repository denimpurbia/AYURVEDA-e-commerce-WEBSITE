import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';
import adminApi from '../../services/adminApi';
import { Plus, Trash2, FolderTree } from 'lucide-react';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await adminApi.get('/categories');
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name) return alert('Category name required');

    try {
      const res = await adminApi.post('/categories', { name, description, image });
      if (res.success) {
        setCategories([...categories, res.data]);
        setName('');
        setDescription('');
        setImage('');
        alert('Category added successfully!');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id, catName) => {
    if (window.confirm(`Delete category "${catName}"?`)) {
      try {
        const res = await adminApi.delete(`/categories/${id}`);
        if (res.success) {
          setCategories(categories.filter((c) => c._id !== id));
        }
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F2E8]/40">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          
          <div>
            <h2 className="font-serif font-bold text-2xl text-[#123D2A]">Category Management</h2>
            <p className="text-xs text-[#7A6248]">Control product categories displayed across the store.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Create Category Form */}
            <form onSubmit={handleAddCategory} className="lg:col-span-4 bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] space-y-4 shadow-xs">
              <h3 className="font-serif font-bold text-lg text-[#123D2A] flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#789B72]" /> Add New Category
              </h3>

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Skin Care"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Brief description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#123D2A] uppercase block mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#123D2A] text-white text-xs font-bold rounded-full flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#C49A52]" /> CREATE CATEGORY
              </button>
            </form>

            {/* Category List */}
            <div className="lg:col-span-8 bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] shadow-xs">
              <h3 className="font-serif font-bold text-lg text-[#123D2A] mb-4">Existing Categories ({categories.length})</h3>

              {loading ? (
                <p className="text-xs font-bold text-[#123D2A]">Loading categories...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <div key={cat._id} className="p-4 bg-[#F7F2E8]/60 rounded-xl border border-[#EAE1D2] flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={cat.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'} alt={cat.name} className="w-12 h-12 object-cover rounded-lg" />
                        <div>
                          <h4 className="font-bold text-xs text-[#123D2A]">{cat.name}</h4>
                          <span className="text-[10px] text-[#7A6248]">slug: {cat.slug}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(cat._id, cat.name)}
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
