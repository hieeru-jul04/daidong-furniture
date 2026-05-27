import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaTrash, FaSpinner, FaUserCircle, FaEye, FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { userApi } from '../../../services/user.api';
import ConfirmModal from '../../../components/shared/ConfirmModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Confirm Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: 10 };
      if (searchTerm) params.search = searchTerm;
      
      const res = await userApi.getAll(params);
      setUsers(res.data.users);
      setPagination(p => ({ ...p, total: res.data.total, totalPages: res.data.totalPages }));
    } catch (err) {
      console.error('Lỗi tải danh sách khách hàng:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, pagination.page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUserClick = (id, name) => {
    setUserToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUserConfirm = async () => {
    if (!userToDelete) return;
    try {
      await userApi.delete(userToDelete.id);
      fetchUsers();
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Xóa người dùng thất bại');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Khách hàng</h1>
          <p className="text-gray-500 text-sm mt-1">Tổng cộng: <span className="font-bold text-gray-800">{pagination.total}</span> khách hàng</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm theo mã KH, tên, username..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-daidong-black focus:border-transparent" 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setPagination(p => ({ ...p, page: 1 })); }} 
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Mã KH</th>
                <th className="px-6 py-4">Tên đăng nhập</th>
                <th className="px-6 py-4">Quyền</th>
                <th className="px-6 py-4">Ngày đăng ký</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center"><FaSpinner className="animate-spin mx-auto text-gray-400 text-2xl" /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Không tìm thấy khách hàng nào.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center flex-shrink-0">
                          <FaUserCircle size={24} />
                        </div>
                        <span className="font-bold text-gray-900">{user.name || 'Người dùng'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-bold font-mono text-xs">{user.customerCode || <span className="text-gray-400 font-normal italic">Chưa có</span>}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{user.username}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-700 capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setSelectedUser(user)} 
                          className="text-blue-500 cursor-pointer hover:text-blue-700 transition-colors p-2 hover:bg-blue-50 rounded-lg inline-flex items-center gap-1 font-medium text-xs"
                          title="Xem chi tiết"
                        >
                          <FaEye size={14} /> Xem
                        </button>
                        <button 
                          onClick={() => handleDeleteUserClick(user._id, user.name || user.username)} 
                          className="text-red-400 cursor-pointer hover:text-daidong-red transition-colors p-2 hover:bg-red-50 rounded-lg inline-flex items-center gap-1 font-medium text-xs"
                          title="Xóa tài khoản"
                        >
                          <FaTrash size={14} /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <span className="text-sm text-gray-500 font-medium">Hiển thị {users.length} / {pagination.total} khách hàng</span>
          <div className="flex gap-1">
            <button disabled={pagination.page <= 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} className="px-3 py-1 border border-gray-200 bg-white rounded text-gray-500 hover:bg-gray-50 disabled:opacity-40 font-medium transition-colors">Trước</button>
            <span className="px-3 py-1 bg-daidong-black text-white rounded font-bold">{pagination.page}</span>
            <button disabled={pagination.page >= pagination.totalPages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} className="px-3 py-1 border border-gray-200 bg-white rounded text-gray-500 hover:bg-gray-50 disabled:opacity-40 font-medium transition-colors">Sau</button>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-daidong-light-gray p-6 flex justify-between items-center border-b border-gray-100">
              <h3 className="text-xl font-bold text-daidong-black">Thông tin khách hàng</h3>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-daidong-red transition-colors p-2 rounded-full hover:bg-white"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-8">
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                <div className="w-20 h-20 rounded-full bg-daidong-light-gray text-gray-400 flex items-center justify-center flex-shrink-0 text-3xl font-bold">
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : <FaUserCircle size={40} />}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{selectedUser.name || 'Người dùng'}</h4>
                  <p className="text-gray-500 font-mono text-sm mb-1">{selectedUser.customerCode ? `Mã KH: ${selectedUser.customerCode}` : ''}</p>
                  <p className="text-gray-500">@{selectedUser.username}</p>
                  <span className="inline-block mt-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-700 capitalize">
                    Vai trò: {selectedUser.role}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                    <FaEnvelope size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="font-bold text-gray-900">{selectedUser.email || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 text-green-500 rounded-xl">
                    <FaPhone size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Số điện thoại</p>
                    <p className="font-bold text-gray-900">{selectedUser.phone || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
                    <FaMapMarkerAlt size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Địa chỉ</p>
                    <p className="font-bold text-gray-900 leading-relaxed">{selectedUser.address || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 text-right">
              <button 
                onClick={() => setSelectedUser(null)}
                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modals */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUserConfirm}
        title="Xóa khách hàng"
        message={`Bạn có chắc chắn muốn xóa tài khoản của khách hàng "${userToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa tài khoản"
        type="danger"
      />
    </div>
  );
};

export default Users;
