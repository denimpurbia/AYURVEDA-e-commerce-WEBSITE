import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';
import adminApi from '../../services/adminApi';
import { PlusCircle, Search, Edit3, Trash2, CheckCircle, XCircle } from 'lucide-react';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/products?limit=50');
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const res = await adminApi.delete(`/products/${id}`);
        if (res.success) {
          setProducts(products.filter((p) => p._id !== id));
          alert('Product deleted successfully');
        }
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F7F2E8]/40">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-serif font-bold text-2xl text-[#123D2A]">Product Management</h2>
              <p className="text-xs text-[#7A6248]">Manage inventory, pricing, stock levels, and formulation descriptions.</p>
            </div>
            <Link
              to="/admin/products/add"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#123D2A] text-white text-xs font-bold rounded-full hover:bg-[#0B2D1E]"
            >
              <PlusCircle className="w-4 h-4 text-[#C49A52]" /> Add New Product
            </Link>
          </div>

          <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] shadow-xs space-y-4">
            
            {/* Search filter */}
            <div className="relative max-w-sm">
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F7F2E8] border border-[#EAE1D2] rounded-xl pl-9 focus:outline-none"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {loading ? (
              <p className="text-xs font-bold text-[#123D2A] py-8 text-center">Loading live products...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EAE1D2] text-[#7A6248] uppercase text-[10px]">
                      <th className="py-3">Product</th>
                      <th className="py-3">Category</th>
                      <th className="py-3">SKU</th>
                      <th className="py-3">Price</th>
                      <th className="py-3">Stock</th>
                      <th className="py-3">Status</th>
                      <th className="py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE1D2]/60">
                    {filtered.map((p) => (
                      <tr key={p._id} className="hover:bg-[#F7F2E8]/40">
                        <td className="py-3 flex items-center space-x-3">
                          <img
                            src={p.images[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'}
                            alt={p.name}
                            className="w-10 h-10 object-contain bg-[#F7F2E8] p-1 rounded-lg border border-[#EAE1D2]"
                          />
                          <div>
                            <span className="font-bold text-[#123D2A] block">{p.name}</span>
                            <span className="text-[10px] text-[#7A6248]">{p.weight}</span>
                          </div>
                        </td>
                        <td className="py-3 font-medium text-[#243229]">{p.category?.name || 'Unassigned'}</td>
                        <td className="py-3 font-mono text-[11px]">{p.sku}</td>
                        <td className="py-3 font-bold text-[#123D2A]">
                          ₹{p.discountPrice > 0 ? p.discountPrice : p.price}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.stock > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3">
                          {p.isActive ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px]">
                              <CheckCircle className="w-3.5 h-3.5" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-600 font-bold text-[10px]">
                              <XCircle className="w-3.5 h-3.5" /> Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/admin/products/${p._id}/edit`}
                              className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50"
                              title="Edit Product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(p._id, p.name)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminProductsPage;
