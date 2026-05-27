import React from 'react';
import { FaPlus, FaBoxOpen, FaDownload, FaUpload } from 'react-icons/fa';

const Inventory = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kho hàng</h1>
          <p className="text-gray-500 text-sm mt-1">Theo dõi mức tồn kho, các lô hàng nhập và đơn hàng xuất.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
            <FaDownload size={14} /> Nhập kho
          </button>
          <button className="bg-daidong-black text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-daidong-red transition-colors shadow-sm">
            <FaPlus size={14} /> Điều chỉnh tồn kho
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <FaBoxOpen size={20} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Tổng sản phẩm trong kho</p>
            <p className="text-2xl font-bold text-gray-900">12,450</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center">
            <FaUpload size={20} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Cảnh báo sắp hết hàng</p>
            <p className="text-2xl font-bold text-gray-900">15</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
            <FaDownload size={20} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Lô hàng đang nhập</p>
            <p className="text-2xl font-bold text-gray-900">3</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Theo dõi chi tiết</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Hệ thống quản lý kho đầy đủ (Theo dõi Nhập kho / Xuất kho) hiện đang được xây dựng. 
          Vui lòng quay lại sau để trải nghiệm đầy đủ tính năng.
        </p>
      </div>
    </div>
  );
};

export default Inventory;
