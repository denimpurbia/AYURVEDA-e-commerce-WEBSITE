import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';
import adminApi from '../../services/adminApi';
import { DollarSign, ShoppingBag, Package, Users, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: [],
    salesChart: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await adminApi.get('/users/dashboard-stats');
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F7F2E8]/40">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-2xl text-[#123D2A]">Dashboard Overview</h2>
              <p className="text-xs text-[#7A6248]">Live MongoDB database metrics & store operations.</p>
            </div>
            <Link to="/admin/products/add" className="px-4 py-2 bg-[#123D2A] text-white text-xs font-bold rounded-full hover:bg-[#0B2D1E]">
              + Add Product
            </Link>
          </div>

          {/* 4 Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#EAE1D2] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#7A6248] uppercase">Total Revenue</span>
                <h3 className="font-serif font-bold text-2xl text-[#123D2A] mt-1">₹{stats.totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#EAE1D2] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#7A6248] uppercase">Total Orders</span>
                <h3 className="font-serif font-bold text-2xl text-[#123D2A] mt-1">{stats.totalOrders}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#EAE1D2] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#7A6248] uppercase">Total Products</span>
                <h3 className="font-serif font-bold text-2xl text-[#123D2A] mt-1">{stats.totalProducts}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#FFFDF8] p-5 rounded-2xl border border-[#EAE1D2] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#7A6248] uppercase">Active Users</span>
                <h3 className="font-serif font-bold text-2xl text-[#123D2A] mt-1">{stats.totalUsers}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* Sales Chart Section */}
          <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-[#123D2A] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#789B72]" /> Revenue & Growth Trends
              </h3>
              <span className="text-xs text-[#7A6248] font-semibold">Monthly Aggregates</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.salesChart}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#123D2A" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#123D2A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE1D2" />
                  <XAxis dataKey="name" stroke="#7A6248" fontSize={11} />
                  <YAxis stroke="#7A6248" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#123D2A" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders & Low Stock Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Recent Orders Table */}
            <div className="lg:col-span-8 bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE1D2] pb-3">
                <h3 className="font-serif font-bold text-lg text-[#123D2A]">Recent Orders</h3>
                <Link to="/admin/orders" className="text-xs font-bold text-[#C49A52] flex items-center gap-1">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EAE1D2] text-[#7A6248] uppercase text-[10px]">
                      <th className="py-2">Tracking #</th>
                      <th className="py-2">Customer</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE1D2]/50">
                    {stats.recentOrders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-[#F7F2E8]/40">
                        <td className="py-3 font-bold text-[#123D2A]">#{ord.trackingNumber || ord._id.slice(-6)}</td>
                        <td className="py-3 font-medium text-[#243229]">{ord.user?.name || 'Guest'}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-[#123D2A]">₹{ord.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Stock Alert List */}
            <div className="lg:col-span-4 bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE1D2] pb-3">
                <h3 className="font-serif font-bold text-lg text-[#123D2A] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Low Stock Items
                </h3>
              </div>

              <div className="space-y-3">
                {stats.lowStockProducts.length === 0 ? (
                  <p className="text-xs text-[#7A6248]">All items are well stocked!</p>
                ) : (
                  stats.lowStockProducts.map((p) => (
                    <div key={p._id} className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-[#123D2A] line-clamp-1">{p.name}</h4>
                        <span className="text-[10px] text-[#7A6248]">SKU: {p.sku}</span>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-200 text-amber-900 font-bold text-xs rounded-full">
                        {p.stock} left
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
