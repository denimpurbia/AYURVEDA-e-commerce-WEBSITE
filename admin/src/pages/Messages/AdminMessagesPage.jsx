import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';
import adminApi from '../../services/adminApi';
import {
  Mail,
  User,
  Trash2,
  CheckCircle,
  Clock,
} from 'lucide-react';

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const res = await adminApi.get('/contact');

      if (res.success) {
        setMessages(res.data);
      }
    } catch (error) {
      console.error(error);
      alert(error.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id) => {
    try {
      const res = await adminApi.put(`/contact/${id}/read`);

      if (res.success) {
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message._id === id
              ? { ...message, status: 'read' }
              : message
          )
        );
      }
    } catch (error) {
      alert(error.message || 'Failed to update message');
    }
  };

  const deleteMessage = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this message?'
    );

    if (!confirmDelete) return;

    try {
      const res = await adminApi.delete(`/contact/${id}`);

      if (res.success) {
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message._id !== id)
        );
      }
    } catch (error) {
      alert(error.message || 'Failed to delete message');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F7F2E8]/40">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <AdminTopbar />

          <main className="p-6">
            <p className="text-sm font-bold text-[#123D2A]">
              Loading messages...
            </p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F2E8]/40">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Page Header */}
          <div>
            <h1 className="font-serif font-bold text-3xl text-[#123D2A]">
              Contact Messages
            </h1>

            <p className="text-sm text-[#7A6248] mt-1">
              View and manage messages received from customers.
            </p>
          </div>

          {/* Messages */}
          <div className="bg-[#FFFDF8] rounded-3xl border border-[#EAE1D2] p-6">
            {messages.length === 0 ? (
              <div className="text-center py-16">
                <Mail className="w-12 h-12 mx-auto text-[#C49A52] mb-4" />

                <h3 className="font-serif font-bold text-xl text-[#123D2A]">
                  No Messages Yet
                </h3>

                <p className="text-sm text-[#7A6248] mt-2">
                  Customer contact messages will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`border rounded-2xl p-5 transition-all ${
                      message.status === 'unread'
                        ? 'border-[#C49A52] bg-[#F7F2E8]'
                        : 'border-[#EAE1D2] bg-white'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Message Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-[#C49A52]" />

                            <span className="font-bold text-sm text-[#123D2A]">
                              {message.name}
                            </span>
                          </div>

                          <div
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                              message.status === 'unread'
                                ? 'bg-[#C49A52]/20 text-[#8A6427]'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {message.status}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#7A6248] mb-3">
                          <Mail className="w-4 h-4" />
                          {message.email}
                        </div>

                        <h3 className="font-bold text-[#123D2A] text-sm mb-2">
                          {message.subject}
                        </h3>

                        <p className="text-sm text-[#243229] leading-relaxed">
                          {message.message}
                        </p>

                        <div className="flex items-center gap-2 mt-4 text-xs text-[#7A6248]">
                          <Clock className="w-4 h-4" />

                          {new Date(
                            message.createdAt
                          ).toLocaleString()}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-2">
                        {message.status === 'unread' && (
                          <button
                            onClick={() =>
                              markAsRead(message._id)
                            }
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#123D2A] text-white text-xs font-bold hover:bg-[#0B2D1E]"
                          >
                            <CheckCircle className="w-4 h-4 text-[#C49A52]" />
                            Mark Read
                          </button>
                        )}

                        <button
                          onClick={() =>
                            deleteMessage(message._id)
                          }
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminMessagesPage;