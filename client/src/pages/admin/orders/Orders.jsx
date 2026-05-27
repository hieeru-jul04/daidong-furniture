import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaEye, FaSpinner, FaTimes, FaCheck, FaTruck, FaBox, FaUndo, FaTrash } from 'react-icons/fa';
import { orderApi } from '../../../services/order.api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [editedStatus, setEditedStatus] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: 10 };
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      
      const res = await orderApi.getAllOrders(params);
      setOrders(res.data.orders);
      setPagination(p => ({ ...p, total: res.data.total, totalPages: res.data.totalPages }));
    } catch (err) {
      console.error('Lỗi tải đơn hàng:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, pagination.page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setEditedStatus(order.status);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await orderApi.updateOrderStatus(orderId, newStatus);
      // Update local state
      setOrders(orders.map(o => o._id === orderId ? res.data : o));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(res.data);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Cập nhật trạng thái thất bại');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này vĩnh viễn?')) {
      try {
        await orderApi.deleteOrder(orderId);
        setOrders(orders.filter(o => o._id !== orderId));
        setPagination(p => ({ ...p, total: p.total - 1 }));
      } catch (error) {
        alert(error.response?.data?.message || 'Lỗi khi xóa đơn hàng');
      }
    }
  };

  const statusConfig = {
    'Pending': { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <FaBox />, label: 'Chờ xử lý' },
    'Processing': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <FaSpinner className="animate-spin" />, label: 'Đang xử lý' },
    'Shipped': { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: <FaTruck />, label: 'Đang giao' },
    'Delivered': { color: 'bg-green-100 text-green-700 border-green-200', icon: <FaCheck />, label: 'Đã giao' },
    'Cancelled': { color: 'bg-red-100 text-red-700 border-red-200', icon: <FaUndo />, label: 'Đã hủy' }
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig['Pending'];
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border ${config.color}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getImageSrc = (img) => img?.startsWith('http') ? img : `${BASE_URL}${img}`;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
          <p className="text-gray-500 text-sm mt-1">Tổng cộng: <span className="font-bold text-gray-800">{pagination.total}</span> đơn hàng</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm theo Mã đơn, Mã KH, Tên KH, SĐT..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-daidong-black focus:border-transparent" 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setPagination(p => ({ ...p, page: 1 })); }} 
          />
        </div>
        <select 
          className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-daidong-black w-full md:w-auto font-medium" 
          value={statusFilter} 
          onChange={(e) => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Pending">Chờ xử lý</option>
          <option value="Processing">Đang xử lý</option>
          <option value="Shipped">Đang giao</option>
          <option value="Delivered">Đã giao</option>
          <option value="Cancelled">Đã hủy</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Mã đơn hàng</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Ngày đặt</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center"><FaSpinner className="animate-spin mx-auto text-gray-400 text-2xl" /></td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Không tìm thấy đơn hàng nào.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{order.shippingInfo.fullName}</div>
                      {order.user?.customerCode && <div className="text-xs text-blue-600 font-bold font-mono mt-0.5">{order.user.customerCode}</div>}
                      <div className="text-xs text-gray-500 mt-0.5">{order.shippingInfo.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4 font-bold text-daidong-red">${order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button 
                        onClick={() => handleViewOrder(order)} 
                        className="text-gray-500 hover:text-daidong-black transition-colors p-2 hover:bg-gray-200 rounded-lg inline-flex items-center gap-1 font-medium text-xs"
                      >
                        <FaEye size={14} /> Chi tiết
                      </button>
                      <button 
                        onClick={() => handleDeleteOrder(order._id)} 
                        className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg inline-flex items-center gap-1 font-medium text-xs ml-2"
                      >
                        <FaTrash size={14} /> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <span className="text-sm text-gray-500 font-medium">Hiển thị {orders.length} / {pagination.total} đơn hàng</span>
          <div className="flex gap-1">
            <button disabled={pagination.page <= 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} className="px-3 py-1 border border-gray-200 bg-white rounded text-gray-500 hover:bg-gray-50 disabled:opacity-40 font-medium transition-colors">Trước</button>
            <span className="px-3 py-1 bg-daidong-black text-white rounded font-bold">{pagination.page}</span>
            <button disabled={pagination.page >= pagination.totalPages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} className="px-3 py-1 border border-gray-200 bg-white rounded text-gray-500 hover:bg-gray-50 disabled:opacity-40 font-medium transition-colors">Sau</button>
          </div>
        </div>
      </div>

      {/* MODAL: Order Details */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 lg:p-8 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Đơn hàng #{selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}
                  {getStatusBadge(selectedOrder.status)}
                </h2>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  Ngày đặt: <span className="font-semibold text-gray-700">{formatDate(selectedOrder.createdAt)}</span>
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-900 transition-colors">
                <FaTimes size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 lg:p-8 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Col: Order Items */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Danh sách sản phẩm</h3>
                  <div className="space-y-4">
                    {selectedOrder.orderItems.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-4 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors bg-white">
                        <img src={getImageSrc(item.image)} alt={item.name} className="w-20 h-20 object-cover rounded-xl shadow-sm" />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-sm md:text-base">{item.name}</h4>
                          {item.variant?.name && (
                            <p className="text-sm text-gray-500 mt-0.5">Phân loại: <span className="font-medium text-gray-700">{item.variant.name}</span></p>
                          )}
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-600 font-medium text-sm">SL: {item.quantity}</span>
                            <span className="font-bold text-daidong-red">${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Col: Info & Actions */}
                <div className="space-y-8">
                  {/* Shipping Info */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Thông tin giao hàng</h3>
                    <div className="space-y-3 text-sm">
                      <p><span className="font-medium text-gray-500 block">Khách hàng:</span> <span className="font-bold text-gray-900 text-base">{selectedOrder.shippingInfo.fullName}</span></p>
                      {selectedOrder.user?.customerCode && (
                        <p><span className="font-medium text-gray-500 block">Mã khách hàng:</span> <span className="font-bold text-blue-600 font-mono">{selectedOrder.user.customerCode}</span></p>
                      )}
                      <p><span className="font-medium text-gray-500 block">Điện thoại:</span> <span className="font-bold text-gray-900">{selectedOrder.shippingInfo.phone}</span></p>
                      <p><span className="font-medium text-gray-500 block">Thành phố:</span> <span className="font-bold text-gray-900">{selectedOrder.shippingInfo.city}</span></p>
                      <p><span className="font-medium text-gray-500 block">Địa chỉ:</span> <span className="font-medium text-gray-800">{selectedOrder.shippingInfo.address}</span></p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Thanh toán</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between"><span>Phương thức:</span> <span className="font-bold uppercase text-gray-900">{selectedOrder.paymentMethod}</span></div>
                      <div className="flex justify-between"><span>Tạm tính:</span> <span className="font-medium">${selectedOrder.itemsPrice.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Phí giao hàng:</span> <span className="font-medium">${selectedOrder.shippingPrice.toFixed(2)}</span></div>
                      <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between items-center">
                        <span className="font-bold text-gray-900">Tổng cộng:</span> 
                        <span className="text-xl font-bold text-daidong-red">${selectedOrder.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Actions */}
                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                     <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">Cập nhật Trạng thái</h3>
                     <select 
                        className="w-full p-3 rounded-xl border border-blue-200 bg-white font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 mb-3 transition-shadow shadow-sm cursor-pointer"
                        value={editedStatus}
                        onChange={(e) => setEditedStatus(e.target.value)}
                        disabled={updatingStatus}
                     >
                        <option value="Pending">Chờ xử lý</option>
                        <option value="Processing">Đang xử lý</option>
                        <option value="Shipped">Đang giao</option>
                        <option value="Delivered">Đã giao</option>
                        <option value="Cancelled">Đã hủy</option>
                     </select>
                     <button 
                        onClick={() => handleUpdateStatus(selectedOrder._id, editedStatus)}
                        disabled={updatingStatus || editedStatus === selectedOrder.status}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer"
                     >
                        {updatingStatus ? <FaSpinner className="animate-spin" /> : 'Lưu trạng thái'}
                     </button>
                     <p className="text-xs text-blue-600 leading-relaxed mt-3">Thay đổi trạng thái sẽ cập nhật trực tiếp trên hệ thống và phía khách hàng.</p>
                  </div>

                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-8 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-colors shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Orders;