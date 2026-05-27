import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaBoxOpen, FaKey, FaChevronRight, FaCheckCircle, FaTruck, FaTimesCircle, FaSpinner, FaBox } from 'react-icons/fa';
import { orderApi } from '../../services/order.api';
import { authApi } from '../../services/auth.api';
import ConfirmModal from '../../components/shared/ConfirmModal';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [userProfile, setUserProfile] = useState(null);
  
  // Confirm Modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await orderApi.getMyOrders();
        setOrders(res.data);
      } catch (error) {
        console.error("Lỗi tải lịch sử đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchProfile = async () => {
      try {
        const res = await authApi.getProfile();
        setUserProfile(res.data.user);
      } catch (error) {
        console.error("Lỗi khi tải thông tin cá nhân:", error);
      }
    };

    fetchMyOrders();
    fetchProfile();
  }, []);

  const handleCancelClick = (orderId) => {
    setOrderToCancel(orderId);
    setIsCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!orderToCancel) return;
    try {
      await orderApi.cancelOrder(orderToCancel);
      setOrders(orders.map(o => o._id === orderToCancel ? { ...o, status: 'Cancelled' } : o));
      setIsCancelModalOpen(false);
      setOrderToCancel(null);
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      alert(error.response?.data?.message || "Lỗi khi hủy đơn hàng");
    }
  };

  const toggleDetails = (id) => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Delivered':
        return <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase"><FaCheckCircle /> Đã giao</span>;
      case 'Shipped':
        return <span className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase"><FaTruck /> Đang giao</span>;
      case 'Cancelled':
        return <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase"><FaTimesCircle /> Đã hủy</span>;
      case 'Processing':
        return <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase"><FaSpinner className="animate-spin" /> Đang xử lý</span>;
      case 'Pending':
        return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase"><FaBox /> Chờ xử lý</span>;
      default:
        return <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const getImageSrc = (img) => img?.startsWith('http') ? img : `${BASE_URL}${img}`;

  const displayName = userProfile?.name || userProfile?.username || 'Người dùng';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="bg-daidong-light-gray min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-daidong-black pt-32 pb-12 rounded-b-[3rem] mb-12 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center text-sm text-daidong-gray mb-4">
            <Link to="/" className="hover:text-daidong-white transition-colors">Trang chủ</Link>
            <FaChevronRight className="mx-2 text-[10px]" />
            <span className="text-daidong-white font-bold">Lịch sử đơn hàng</span>
          </div>
          <h1 className="text-4xl font-bold text-daidong-white">Lịch sử đơn hàng</h1>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-daidong-white rounded-[2rem] p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-daidong-border">
                <div className="w-16 h-16 rounded-full bg-daidong-light-gray flex items-center justify-center text-daidong-gray text-2xl font-bold">
                  {initial}
                </div>
                <div>
                  <h3 className="font-bold text-daidong-black">{displayName}</h3>
                  <p className="text-sm text-daidong-gray">Thành viên DAIDONG</p>
                </div>
              </div>

              <div className="space-y-2">
                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-daidong-gray hover:bg-daidong-light-gray hover:text-daidong-black font-bold transition-colors">
                  <FaUser /> Thông tin cá nhân
                </Link>
                <Link to="/order-history" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-daidong-black text-daidong-white font-bold transition-colors">
                  <FaBoxOpen /> Lịch sử đơn hàng
                </Link>
                <Link to="/profile" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-daidong-gray hover:bg-daidong-light-gray hover:text-daidong-black font-bold transition-colors">
                  <FaKey /> Đổi mật khẩu
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <div className="bg-daidong-white rounded-[2rem] p-8 md:p-12 shadow-sm">
              <h2 className="text-2xl font-bold text-daidong-black mb-8">Đơn hàng của bạn</h2>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <FaSpinner className="animate-spin text-4xl text-daidong-gray" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-daidong-gray mb-4 flex justify-center"><FaBoxOpen size={48} /></div>
                  <h3 className="text-xl font-bold text-daidong-black mb-2">Chưa có đơn hàng nào</h3>
                  <p className="text-daidong-gray mb-6">Bạn chưa thực hiện bất kỳ đơn hàng nào tại DAIDONG.</p>
                  <Link to="/shop" className="bg-daidong-black text-daidong-white px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-daidong-red transition-colors inline-block">
                    Mua sắm ngay
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  {orders.map(order => (
                    <div key={order._id} className="border border-daidong-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                      {/* Order Header */}
                      <div className="bg-daidong-light-gray p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-daidong-border">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                          <div>
                            <p className="text-xs text-daidong-gray font-bold uppercase mb-1">Mã đơn hàng</p>
                            <p className="font-bold text-daidong-black font-mono">#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-daidong-gray font-bold uppercase mb-1">Ngày đặt</p>
                            <p className="font-bold text-daidong-black">{formatDate(order.createdAt)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-daidong-gray font-bold uppercase mb-1">Tổng tiền</p>
                            <p className="font-bold text-daidong-red">${order.totalPrice.toFixed(2)}</p>
                          </div>
                        </div>
                        <div>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-4 md:p-6 space-y-4">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="flex gap-4 items-center">
                            <img src={getImageSrc(item.image)} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-daidong-border shadow-sm" />
                            <div className="flex-1">
                              <h4 className="font-bold text-daidong-black text-sm md:text-base">{item.name}</h4>
                              {item.variant?.name && (
                                <p className="text-xs text-daidong-gray mt-0.5">Phân loại: <span className="font-medium text-gray-700">{item.variant.name}</span></p>
                              )}
                              <p className="text-sm text-daidong-gray mt-1">Số lượng: {item.quantity}</p>
                            </div>
                            <div className="font-bold text-daidong-black">
                              ${item.price.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Details Expanded */}
                      {expandedOrderId === order._id && (
                        <div className="p-4 md:p-6 bg-gray-50 border-t border-daidong-border text-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-bold text-daidong-black mb-2 uppercase text-xs">Thông tin giao hàng</h4>
                              <p className="text-daidong-gray mb-1"><span className="font-medium text-daidong-black">Người nhận:</span> {order.shippingInfo?.fullName}</p>
                              <p className="text-daidong-gray mb-1"><span className="font-medium text-daidong-black">Số điện thoại:</span> {order.shippingInfo?.phone}</p>
                              <p className="text-daidong-gray mb-1"><span className="font-medium text-daidong-black">Địa chỉ:</span> {order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.country}</p>
                            </div>
                            <div>
                              <h4 className="font-bold text-daidong-black mb-2 uppercase text-xs">Thông tin thanh toán</h4>
                              <p className="text-daidong-gray mb-1"><span className="font-medium text-daidong-black">Phương thức:</span> {order.paymentMethod}</p>
                              <p className="text-daidong-gray mb-1"><span className="font-medium text-daidong-black">Trạng thái:</span> {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
                              <p className="text-daidong-gray mb-1"><span className="font-medium text-daidong-black">Phí vận chuyển:</span> ${order.shippingPrice?.toFixed(2) || '0.00'}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Order Actions */}
                      <div className="p-4 bg-daidong-light-gray/50 border-t border-daidong-border flex justify-end gap-3">
                        {order.status === 'Pending' && (
                          <button 
                            onClick={() => handleCancelClick(order._id)}
                            className="text-sm font-bold text-daidong-red hover:text-white transition-colors uppercase tracking-wider px-4 py-2 border-2 border-daidong-red hover:bg-daidong-red rounded-lg">
                            Hủy đơn hàng
                          </button>
                        )}
                        <button 
                          onClick={() => toggleDetails(order._id)}
                          className="text-sm font-bold text-daidong-black hover:text-daidong-red transition-colors uppercase tracking-wider px-4 py-2 border-2 border-daidong-black hover:border-daidong-red rounded-lg">
                          {expandedOrderId === order._id ? 'Thu gọn' : 'Xem chi tiết'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <ConfirmModal 
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        title="Hủy đơn hàng"
        message="Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác."
        confirmText="Hủy đơn hàng"
        type="danger"
      />
    </div>
  );
};

export default OrderHistory;
