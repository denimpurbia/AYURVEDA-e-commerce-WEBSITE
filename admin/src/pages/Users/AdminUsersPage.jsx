import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';
import adminApi from '../../services/adminApi';
import { Users, CheckCircle, XCircle } from 'lucide-react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await adminApi.get('/users');
      if (res.success) setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const res = await adminApi.put(`/users/${userId}/status`, { isActive: !currentStatus });
      if (res.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u));
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
            <h2 className="font-serif font-bold text-2xl text-[#123D2A]">User Management</h2>
            <p className="text-xs text-[#7A6248]">View registered customer accounts and manage permissions.</p>
          </div>

          <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] shadow-xs">
            {loading ? (
              <p className="text-xs font-bold text-[#123D2A] py-8 text-center">Loading users...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EAE1D2] text-[#7A6248] uppercase text-[10px]">
                      <th className="py-3">Name</th>
                      <th className="py-3">Email</th>
                      <th className="py-3">Role</th>
                      <th className="py-3">Phone</th>
                      <th className="py-3">Status</th>
                      <th className="py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE1D2]/60">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-[#F7F2E8]/40">
                        <td className="py-3 font-bold text-[#123D2A]">{u.name}</td>
                        <td className="py-3 font-medium text-[#243229]">{u.email}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 text-[#7A6248]">{u.phone || 'N/A'}</td>
                        <td className="py-3">
                          {u.isActive ? (
                            <span className="text-emerald-700 font-bold text-[10px]">Active</span>
                          ) : (
                            <span className="text-red-600 font-bold text-[10px]">Disabled</span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => toggleUserStatus(u._id, u.isActive)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                u.isActive ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          )}
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

export default AdminUsersPage;
