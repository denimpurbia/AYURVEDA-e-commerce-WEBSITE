import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import AnnouncementBar from '../../components/layout/AnnouncementBar';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

import API from '../../services/api';

import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Star,
} from 'lucide-react';

const statusStepMap = {
  Pending: 1,
  Confirmed: 2,
  Processing: 3,
  Shipped: 4,
  Delivered: 5,
  Cancelled: 0,
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders/my-orders');

        if (res.success) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">
      <AnnouncementBar />

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">

        {/* Page Header */}
        <div className="border-b border-[#EAE1D2] pb-4 mb-8">
          <span className="text-xs font-bold tracking-widest text-[#7A6248] uppercase block mb-1">
            PURCHASE HISTORY
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123D2A]">
            My Orders ({orders.length})
          </h1>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="py-20 text-center text-xs font-bold text-[#123D2A]">
            Loading order history...
          </div>
        ) : orders.length === 0 ? (

          <div className="bg-[#F7F2E8] p-12 text-center rounded-3xl border border-[#EAE1D2] space-y-4 max-w-lg mx-auto">

            <Package className="w-12 h-12 text-[#123D2A] mx-auto" />

            <h2 className="font-serif text-xl font-bold text-[#123D2A]">
              No Orders Placed Yet
            </h2>

            <p className="text-xs text-[#7A6248]">
              When you order products, they will show up here with live status tracking.
            </p>

            <Link
              to="/shop"
              className="inline-block px-6 py-2.5 bg-[#123D2A] text-white text-xs font-bold rounded-full"
            >
              Explore Products
            </Link>

          </div>

        ) : (

          <div className="space-y-6">

            {orders.map((order) => {

              const currentStep =
                statusStepMap[order.orderStatus] || 1;

              const isCancelled =
                order.orderStatus === 'Cancelled';

              return (

                <div
                  key={order._id}
                  className="bg-[#FFFDF8] rounded-2xl border border-[#EAE1D2] shadow-card overflow-hidden"
                >

                  {/* Order Header */}
                  <div className="bg-[#F7F2E8] p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#EAE1D2] text-xs">

                    <div>
                      <span className="font-bold text-[#123D2A] block">
                        Order ID: #
                        {order.trackingNumber ||
                          order._id.slice(-8)}
                      </span>

                      <span className="text-[#7A6248]">
                        Placed on{' '}
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">

                      <span className="font-bold text-[#123D2A]">
                        Total: ₹{order.totalAmount} (
                        {order.paymentMethod})
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] ${
                          isCancelled
                            ? 'bg-red-100 text-red-800'
                            : order.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {order.orderStatus}
                      </span>

                    </div>

                  </div>

                  {/* Order Status */}
                  {!isCancelled && (

                    <div className="p-6 border-b border-[#EAE1D2] bg-[#FFFDF8]">

                      <div className="flex items-center justify-between text-[11px] font-bold text-[#123D2A] max-w-2xl mx-auto">

                        <div className="flex flex-col items-center">

                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              currentStep >= 1
                                ? 'bg-[#123D2A] text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            <Clock className="w-4 h-4" />
                          </div>

                          <span className="mt-1">
                            Order Placed
                          </span>

                        </div>

                        <div className="flex flex-col items-center">

                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              currentStep >= 3
                                ? 'bg-[#123D2A] text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            <Package className="w-4 h-4" />
                          </div>

                          <span className="mt-1">
                            Processing
                          </span>

                        </div>

                        <div className="flex flex-col items-center">

                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              currentStep >= 4
                                ? 'bg-[#123D2A] text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            <Truck className="w-4 h-4" />
                          </div>

                          <span className="mt-1">
                            Shipped
                          </span>

                        </div>

                        <div className="flex flex-col items-center">

                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              currentStep >= 5
                                ? 'bg-emerald-700 text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </div>

                          <span className="mt-1">
                            Delivered
                          </span>

                        </div>

                      </div>

                    </div>

                  )}

                  {/* Order Items */}
                  <div className="p-6 space-y-4">

                    {order.items.map((item, idx) => (

                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs py-4 border-b border-[#EAE1D2]/60 last:border-none"
                      >

                        {/* LEFT SIDE - PRODUCT */}
                        <div className="flex items-center gap-4 flex-1">

                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-contain bg-[#F7F2E8] p-1 rounded-lg"
                          />

                          <div>
                            <span className="font-bold text-[#123D2A] block text-sm">
                              {item.name}
                            </span>

                            <span className="text-[#7A6248] block mt-1">
                              Qty: {item.quantity} x ₹{item.price}
                            </span>
                          </div>

                        </div>

                        {/* RIGHT SIDE - REVIEW AND PRICE */}
                        <div className="flex items-center gap-5 sm:gap-8">

                          {order.orderStatus === 'Delivered' && (

                            <Link
                              to={`/product-review/${item.product}?orderId=${order._id}`}
                              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#123D2A] text-white rounded-full font-bold hover:bg-[#0c2b1e] transition whitespace-nowrap"
                            >
                              <Star className="w-4 h-4" />

                              Write Review
                            </Link>

                          )}

                          <span className="font-bold text-[#123D2A] text-sm whitespace-nowrap min-w-[70px] text-right">
                            ₹{item.price * item.quantity}
                          </span>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </main>

      <Footer />

    </div>
  );
};

export default OrdersPage;