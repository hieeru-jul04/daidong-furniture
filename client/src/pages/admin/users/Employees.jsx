import React from 'react';
import { FaPlus, FaSearch, FaUserTie, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const Employees = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nhân viên</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý tài khoản, vai trò và quyền hạn của nhân sự.</p>
        </div>
        <button 
          className="bg-daidong-black text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-daidong-red transition-colors shadow-sm"
        >
          <FaPlus size={14} /> Thêm nhân viên
        </button>
      </div>

      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <FaUserTie size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Quản lý Nhân sự</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          Module này hiện đang được phát triển. Sắp tới bạn sẽ có thể quản lý tài khoản nhân viên, phân công vai trò và theo dõi hiệu suất làm việc tại đây.
        </p>
        <button className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Tìm hiểu thêm
        </button>
      </div>
    </div>
  );
};

export default Employees;
