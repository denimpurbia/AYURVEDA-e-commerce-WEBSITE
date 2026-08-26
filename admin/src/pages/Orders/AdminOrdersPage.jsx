import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';
import adminApi from '../../services/adminApi';
import { ShoppingBag, Eye } from 'lucide-react';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await adminApi.get('/orders');
      if (res.success) setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await adminApi.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      if (res.success) {
        setOrders(orders.map(o => o._id === orderId ? res.data : o));
        alert(`Order status updated to '${newStatus}'`);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F2E8]/40">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div>
            <h2 className="font-serif font-bold text-2xl text-[#123D2A]">Order Management</h2>
            <p className="text-xs text-[#7A6248]">Manage customer orders, update tracking status, and confirm COD payments.</p>
          </div>

          <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] shadow-xs">
            {loading ? (
              <p className="text-xs font-bold text-[#123D2A] py-8 text-center">Loading live orders...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EAE1D2] text-[#7A6248] uppercase text-[10px]">
                      <th className="py-3">Tracking #</th>
                      <th className="py-3">Customer</th>
                      <th className="py-3">Items</th>
                      <th className="py-3">Payment</th>
                      <th className="py-3">Order Status</th>
                      <th className="py-3 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE1D2]/60">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-[#F7F2E8]/40">
                        <td className="py-3 font-bold text-[#123D2A]">#{ord.trackingNumber || ord._id.slice(-6)}</td>
                        <td className="py-3">
                          <span className="font-bold text-[#123D2A] block">{ord.shippingAddress?.name || ord.user?.name}</span>
                          <span className="text-[10px] text-[#7A6248]">{ord.shippingAddress?.city}, {ord.shippingAddress?.pincode}</span>
                        </td>
                        <td className="py-3 font-medium">{ord.items.length} item(s)</td>
                        <td className="py-3 font-bold text-[#123D2A]">
                          ₹{ord.totalAmount}
                          <span className={`block text-[10px] ${ord.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-800'}`}>
                            {ord.paymentStatus} ({ord.paymentMethod})
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.orderStatus === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                            className="px-2.5 py-1 bg-[#F7F2E8] border border-[#EAE1D2] rounded-lg text-xs font-bold text-[#123D2A] focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
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

export default AdminOrdersPage;
