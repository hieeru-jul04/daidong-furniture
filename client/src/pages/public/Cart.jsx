import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import { useShop } from '../../contexts/ShopContext';
import ConfirmModal from '../../components/shared/ConfirmModal';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useShop();
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState(() =>
    Object.fromEntries(cart.map(item => [item.cartKey, true]))
  );

  // Confirm Modal states
  const [isDeleteSelectedModalOpen, setIsDeleteSelectedModalOpen] = useState(false);
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const toggleCheck = (cartKey) => {
    setCheckedItems(prev => ({ ...prev, [cartKey]: !prev[cartKey] }));
  };

  const toggleAll = () => {
    const allChecked = cart.every(item => checkedItems[item.cartKey]);
    setCheckedItems(Object.fromEntries(cart.map(item => [item.cartKey, !allChecked])));
  };

  const selectedItems = cart.filter(item => checkedItems[item.cartKey]);
  const selectedTotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const allChecked = cart.length > 0 && cart.every(item => checkedItems[item.cartKey]);

  const handleDeleteSelectedClick = () => {
    setIsDeleteSelectedModalOpen(true);
  };

  const handleDeleteSelectedConfirm = () => {
    selectedItems.forEach(item => removeFromCart(item.cartKey));
    setCheckedItems({});
    setIsDeleteSelectedModalOpen(false);
  };

  const handleDeleteItemClick = (cartKey) => {
    setItemToDelete(cartKey);
    setIsDeleteItemModalOpen(true);
  };

  const handleDeleteItemConfirm = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete);
      setIsDeleteItemModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để đặt hàng!');
      return;
    }
    navigate('/checkout', { state: { items: selectedItems } });
  };

  return (
    <div className="min-h-screen bg-daidong-light-gray">
      {/* Header Banner */}
      <div className="bg-daidong-black pt-32 pb-12 rounded-b-[3rem] mb-10 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center text-sm text-daidong-gray mb-4">
            <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
            <FaChevronRight className="mx-2 text-[10px]" />
            <span className="text-daidong-white font-bold">Giỏ hàng</span>
          </div>
          <h1 className="text-4xl font-black text-daidong-white">Giỏ Hàng</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-20">
        {cart.length === 0 ? (
          /* Empty Cart */
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="w-32 h-32 bg-daidong-white rounded-full flex items-center justify-center shadow-lg">
              <FaShoppingBag className="text-gray-300 text-6xl" />
            </div>
            <h2 className="text-2xl font-black text-daidong-black">Giỏ hàng của bạn đang trống</h2>
            <p className="text-daidong-gray font-medium">Hãy khám phá sản phẩm và thêm vào giỏ hàng nhé!</p>
            <Link to="/shop" className="mt-2 flex items-center gap-2 bg-daidong-black text-daidong-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-daidong-red transition-colors shadow-lg">
              <FaArrowLeft size={14} /> Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Table */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="bg-daidong-white rounded-2xl shadow-sm p-4 mb-4 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="w-5 h-5 accent-daidong-red cursor-pointer rounded"
                  />
                  <span className="font-bold text-daidong-black text-sm">
                    Chọn tất cả ({cart.length} sản phẩm)
                  </span>
                </label>
                {selectedItems.length > 0 && (
                  <button
                    onClick={handleDeleteSelectedClick}
                    className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold text-sm transition-colors"
                  >
                    <FaTrash size={12} /> Xóa đã chọn ({selectedItems.length})
                  </button>
                )}
              </div>

              {/* Items */}
              <div className="space-y-3">
                {cart.map(item => (
                  <div
                    key={item.cartKey}
                    className={`bg-daidong-white rounded-2xl shadow-sm p-4 flex items-center gap-4 transition-all ${checkedItems[item.cartKey] ? 'ring-2 ring-daidong-red/30' : 'opacity-70'}`}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={!!checkedItems[item.cartKey]}
                      onChange={() => toggleCheck(item.cartKey)}
                      className="w-5 h-5 accent-daidong-red cursor-pointer flex-shrink-0 rounded"
                    />

                    {/* Image */}
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl border border-gray-100"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.id}`} className="font-bold text-daidong-black hover:text-daidong-red transition-colors line-clamp-2 text-sm md:text-base">
                        {item.name}
                      </Link>
                      {item.variant && (
                        <span className="inline-block mt-1 text-[11px] bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 font-medium">
                          {item.variant.name}
                        </span>
                      )}
                      <p className="text-daidong-red font-black text-lg mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                        <span className="text-gray-400 font-normal text-xs ml-1">
                          (${item.price.toFixed(2)} / cái)
                        </span>
                      </p>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-2 bg-daidong-light-gray rounded-full px-3 py-2 flex-shrink-0">
                      <button
                        onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-daidong-gray hover:text-daidong-red transition-colors rounded-full hover:bg-white"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="w-8 text-center font-black text-daidong-black text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-daidong-gray hover:text-daidong-red transition-colors rounded-full hover:bg-white"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteItemClick(item.cartKey)}
                      className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-daidong-gray hover:text-daidong-red font-bold text-sm transition-colors">
                <FaArrowLeft size={12} /> Tiếp tục mua sắm
              </Link>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-daidong-white rounded-2xl shadow-sm p-6 sticky top-28">
                <h2 className="text-lg font-black text-daidong-black mb-6 pb-4 border-b border-daidong-border">
                  Tóm tắt đơn hàng
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-daidong-gray">
                    <span>Sản phẩm đã chọn</span>
                    <span className="font-bold text-daidong-black">{selectedItems.length}</span>
                  </div>
                  <div className="flex justify-between text-sm text-daidong-gray">
                    <span>Tổng số lượng</span>
                    <span className="font-bold text-daidong-black">
                      {selectedItems.reduce((s, i) => s + i.quantity, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-daidong-gray">
                    <span>Phí vận chuyển</span>
                    <span className="font-bold text-green-600">Miễn phí</span>
                  </div>
                  <div className="h-px bg-daidong-border my-2" />
                  <div className="flex justify-between text-base">
                    <span className="font-bold text-daidong-black">Tổng thanh toán</span>
                    <span className="font-black text-daidong-red text-xl">${selectedTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider text-sm shadow-lg transition-all ${
                    selectedItems.length > 0
                      ? 'bg-daidong-black text-daidong-white hover:bg-daidong-red hover:-translate-y-1 hover:shadow-xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {selectedItems.length > 0 ? 'Đặt hàng ngay' : 'Chọn sản phẩm để đặt hàng'}
                </button>

                {selectedItems.length === 0 && (
                  <p className="text-center text-xs text-gray-400 mt-3">
                    Hãy tick chọn ít nhất 1 sản phẩm
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modals */}
      <ConfirmModal 
        isOpen={isDeleteSelectedModalOpen}
        onClose={() => setIsDeleteSelectedModalOpen(false)}
        onConfirm={handleDeleteSelectedConfirm}
        title="Xóa mục đã chọn"
        message={`Bạn có chắc chắn muốn xóa ${selectedItems.length} sản phẩm đã chọn khỏi giỏ hàng?`}
        confirmText="Xóa"
        type="danger"
      />

      <ConfirmModal 
        isOpen={isDeleteItemModalOpen}
        onClose={() => setIsDeleteItemModalOpen(false)}
        onConfirm={handleDeleteItemConfirm}
        title="Xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
        confirmText="Xóa"
        type="danger"
      />
    </div>
  );
};

export default Cart;
