import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronRight, FaShieldAlt, FaSpinner } from 'react-icons/fa';
import { useShop } from '../../contexts/ShopContext';
import { orderApi } from '../../services/order.api';

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useShop();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'cod'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cart.map(item => ({
        product: item.id, // Assuming cart item has id
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.images?.[0] || item.image || '', // Fallback for image
        variant: item.variant || {}
      }));

      const orderData = {
        orderItems,
        shippingInfo: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: getCartTotal(),
        shippingPrice: 0,
        totalPrice: getCartTotal()
      };

      // Add user if token exists (optional)
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const decoded = JSON.parse(jsonPayload);
          if (decoded.id) {
            orderData.user = decoded.id;
          }
        } catch (err) {}
      }

      await orderApi.createOrder(orderData);
      
      alert("Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.");
      clearCart();
      navigate('/order-history');
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi đặt hàng, vui lòng thử lại sau.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-daidong-light-gray min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-daidong-black pt-32 pb-12 rounded-b-[3rem] mb-12 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center text-sm text-daidong-gray mb-4">
            <Link to="/" className="hover:text-daidong-white transition-colors">{t('header.home')}</Link>
            <FaChevronRight className="mx-2 text-[10px]" />
            <Link to="/shop" className="hover:text-daidong-white transition-colors">{t('header.shop')}</Link>
            <FaChevronRight className="mx-2 text-[10px]" />
            <span className="text-daidong-white font-bold">Thanh toán</span>
          </div>
          <h1 className="text-4xl font-bold text-daidong-white">Thanh toán an toàn</h1>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Checkout Form */}
          <div className="w-full lg:w-2/3">
            <form onSubmit={handleCheckout} className="space-y-8">
              {/* Shipping Info */}
              <div className="bg-daidong-white p-8 rounded-[2rem] shadow-sm">
                <h2 className="text-2xl font-bold text-daidong-black mb-6">Thông tin giao hàng</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-daidong-dark-gray">Họ và Tên</label>
                    <input 
                      type="text" 
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-daidong-border bg-daidong-light-gray focus:bg-white focus:outline-none focus:ring-2 focus:ring-daidong-black transition-all"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-daidong-dark-gray">Số điện thoại</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-daidong-border bg-daidong-light-gray focus:bg-white focus:outline-none focus:ring-2 focus:ring-daidong-black transition-all"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-daidong-dark-gray">Thành phố/Tỉnh</label>
                    <input 
                      type="text" 
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-daidong-border bg-daidong-light-gray focus:bg-white focus:outline-none focus:ring-2 focus:ring-daidong-black transition-all"
                      placeholder="Nhập thành phố"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-daidong-dark-gray">Địa chỉ chi tiết</label>
                    <input 
                      type="text" 
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-daidong-border bg-daidong-light-gray focus:bg-white focus:outline-none focus:ring-2 focus:ring-daidong-black transition-all"
                      placeholder="Số nhà, tên đường, phường/xã..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-daidong-white p-8 rounded-[2rem] shadow-sm">
                <h2 className="text-2xl font-bold text-daidong-black mb-6">Phương thức thanh toán</h2>
                <div className="space-y-4">
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-daidong-black bg-daidong-light-gray' : 'border-daidong-border hover:border-daidong-dark-gray'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cod" 
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="w-5 h-5 text-daidong-black focus:ring-daidong-black mr-4"
                    />
                    <div>
                      <span className="block font-bold text-daidong-black">Thanh toán khi nhận hàng (COD)</span>
                      <span className="text-sm text-daidong-gray">Thanh toán bằng tiền mặt khi đơn hàng được giao đến bạn.</span>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'banking' ? 'border-daidong-black bg-daidong-light-gray' : 'border-daidong-border hover:border-daidong-dark-gray'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="banking" 
                      checked={formData.paymentMethod === 'banking'}
                      onChange={handleChange}
                      className="w-5 h-5 text-daidong-black focus:ring-daidong-black mr-4"
                    />
                    <div>
                      <span className="block font-bold text-daidong-black">Chuyển khoản ngân hàng</span>
                      <span className="text-sm text-daidong-gray">Chuyển khoản trực tiếp vào tài khoản ngân hàng của DAIDONG.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button (Mobile) */}
              <div className="lg:hidden">
                <button type="submit" disabled={cart.length === 0 || isSubmitting} className="w-full flex items-center justify-center gap-2 bg-daidong-black text-daidong-white py-4 rounded-full font-bold uppercase tracking-wider hover:bg-daidong-red transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? <FaSpinner className="animate-spin" /> : null}
                  Đặt hàng ngay
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-daidong-white p-8 rounded-[2rem] shadow-sm sticky top-24">
              <h2 className="text-2xl font-bold text-daidong-black mb-6">Tóm tắt đơn hàng</h2>
              
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar mb-6">
                {cart.length === 0 ? (
                  <p className="text-daidong-gray text-center py-4">Giỏ hàng của bạn đang trống.</p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 py-4 border-b border-daidong-border last:border-0">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                      <div className="flex-1">
                        <h3 className="font-bold text-daidong-black text-sm mb-1">{item.name}</h3>
                        <p className="text-daidong-gray text-xs mb-2">Số lượng: {item.quantity}</p>
                        <p className="text-daidong-red font-bold text-sm">${item.price}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3 pt-6 border-t border-daidong-border mb-6">
                <div className="flex justify-between text-daidong-dark-gray">
                  <span>Tạm tính:</span>
                  <span className="font-bold">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-daidong-dark-gray">
                  <span>Phí vận chuyển:</span>
                  <span className="font-bold text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between text-daidong-black text-xl font-bold pt-3 border-t border-daidong-border mt-3">
                  <span>Tổng cộng:</span>
                  <span className="text-daidong-red">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout} 
                disabled={cart.length === 0 || isSubmitting} 
                className="w-full bg-daidong-black text-daidong-white py-4 rounded-full font-bold uppercase tracking-wider hover:bg-daidong-red transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hidden lg:flex"
              >
                {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaShieldAlt />}
                Xác nhận đặt hàng
              </button>

              <div className="mt-6 text-center text-xs text-daidong-gray flex items-center justify-center gap-1">
                <FaShieldAlt /> 
                Thông tin của bạn được bảo mật tuyệt đối
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
