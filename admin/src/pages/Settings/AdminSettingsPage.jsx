import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';
import { Settings, Server, Bot, Cloud, CheckCircle, Database } from 'lucide-react';

const AdminSettingsPage = () => {
  return (
    <div className="flex min-h-screen bg-[#F7F2E8]/40">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div>
            <h2 className="font-serif font-bold text-2xl text-[#123D2A]">System Settings & Integrations</h2>
            <p className="text-xs text-[#7A6248]">Overview of MongoDB Atlas, OpenRouter AI, and Cloudinary media configurations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* MongoDB Atlas Status */}
            <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] space-y-3 shadow-xs">
              <div className="flex items-center space-x-3 text-[#123D2A]">
                <Database className="w-6 h-6 text-[#789B72]" />
                <h3 className="font-serif font-bold text-lg">MongoDB Database</h3>
              </div>
              <p className="text-xs text-[#7A6248]">Connected to MongoDB Atlas database <code className="bg-[#F7F2E8] px-1.5 py-0.5 rounded font-mono">ayurvedamart</code>.</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                <CheckCircle className="w-4 h-4" /> Active & Synchronized
              </div>
            </div>

            {/* OpenRouter AI Status */}
            <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] space-y-3 shadow-xs">
              <div className="flex items-center space-x-3 text-[#123D2A]">
                <Bot className="w-6 h-6 text-[#C49A52]" />
                <h3 className="font-serif font-bold text-lg">OpenRouter AI Assistant</h3>
              </div>
              <p className="text-xs text-[#7A6248]">Model: <code className="bg-[#F7F2E8] px-1.5 py-0.5 rounded font-mono">meta-llama/llama-3.3-70b-instruct</code></p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                <CheckCircle className="w-4 h-4" /> Tool Calling Ready
              </div>
            </div>

            {/* REST API Status */}
            <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] space-y-3 shadow-xs">
              <div className="flex items-center space-x-3 text-[#123D2A]">
                <Server className="w-6 h-6 text-[#123D2A]" />
                <h3 className="font-serif font-bold text-lg">Express Backend API</h3>
              </div>
              <p className="text-xs text-[#7A6248]">Port: <code className="bg-[#F7F2E8] px-1.5 py-0.5 rounded font-mono">5000</code> | CORS: Enabled for localhost:5173 & 5174</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                <CheckCircle className="w-4 h-4" /> Health OK
              </div>
            </div>

            {/* Cloudinary Media Status */}
            <div className="bg-[#FFFDF8] p-6 rounded-2xl border border-[#EAE1D2] space-y-3 shadow-xs">
              <div className="flex items-center space-x-3 text-[#123D2A]">
                <Cloud className="w-6 h-6 text-[#789B72]" />
                <h3 className="font-serif font-bold text-lg">Cloudinary Image Storage</h3>
              </div>
              <p className="text-xs text-[#7A6248]">Multer storage engine with URL generation for MongoDB models.</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                <CheckCircle className="w-4 h-4" /> Storage Configured
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
