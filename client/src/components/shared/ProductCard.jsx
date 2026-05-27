import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaEye, FaStar } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../contexts/ShopContext';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useShop();

  const handleProtectedAction = (actionName, callback) => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (!isLoggedIn) {
      alert(`Vui lòng đăng nhập để ${actionName}!`);
      navigate('/login');
      return;
    }
    callback();
  };

  const isWishlisted = wishlist.some(item => item.id === product.id);

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col md:flex-row bg-daidong-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer mb-6">
        <div className="md:w-1/3 relative overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition duration-700 ease-in-out" />
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            {product.sale && (
              <div className="bg-daidong-red text-daidong-white px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-full shadow-md">
                {t('shop.sale')}
              </div>
            )}
            {product.new && (
              <div className="bg-daidong-black text-daidong-white px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-full shadow-md">
                {t('shop.new')}
              </div>
            )}
          </div>
        </div>
        <div className="md:w-2/3 p-8 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center mb-2 gap-1 text-daidong-gray text-xs">
                <FaStar className="text-daidong-red" />
                <span className="font-bold">{product.rating}</span>
                <span>({product.reviews})</span>
              </div>
              <Link to={`/product/${product.id}`}>
                <h3 className="font-bold text-2xl mb-2 text-daidong-black group-hover:text-daidong-red transition-colors">{product.name}</h3>
              </Link>
            </div>
            <div className="text-right">
              {product.originalPrice && (
                <p className="text-daidong-gray line-through text-sm font-medium">${product.originalPrice}</p>
              )}
              <p className="text-daidong-red font-bold text-2xl">${product.price}</p>
            </div>
          </div>
          <p className="text-daidong-gray font-medium mb-6 line-clamp-2">
            {product.description || "Premium quality product crafted with precision and care to elevate your living space."}
          </p>
          <div className="flex items-center gap-4 mt-auto">
            <button 
              onClick={() => handleProtectedAction('thêm vào giỏ hàng', () => addToCart(product))}
              className="bg-daidong-black text-daidong-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm shadow-lg hover:bg-daidong-red transition-colors duration-300 flex-1 md:flex-none"
            >
              {t('shop.add_to_cart')}
            </button>
            <button 
              onClick={() => handleProtectedAction('thêm vào yêu thích', () => toggleWishlist(product))}
              className={`w-12 h-12 flex items-center justify-center rounded-full shadow-sm hover:shadow-md transition-all ${isWishlisted ? 'bg-daidong-red text-daidong-white' : 'bg-daidong-light-gray text-daidong-gray hover:text-daidong-red hover:bg-daidong-white'}`}
            >
              <FaHeart size={18} />
            </button>
            <Link to={`/product/${product.id}`} className="bg-daidong-light-gray w-12 h-12 flex items-center justify-center rounded-full text-daidong-gray hover:text-daidong-black hover:bg-daidong-white shadow-sm hover:shadow-md transition-all">
              <FaEye size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-[2rem] mb-6 bg-daidong-white">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="w-full h-80 md:h-[28rem] object-cover group-hover:scale-105 transition duration-700 ease-in-out" />
        </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
          {product.sale && (
            <div className="bg-daidong-red text-daidong-white px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-full shadow-md">
              {t('shop.sale')}
            </div>
          )}
          {product.new && (
            <div className="bg-daidong-black text-daidong-white px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-full shadow-md">
              {t('shop.new')}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 delay-100">
          <button 
            onClick={() => handleProtectedAction('thêm vào yêu thích', () => toggleWishlist(product))}
            className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition-all ${isWishlisted ? 'bg-daidong-red text-daidong-white' : 'bg-daidong-white text-daidong-gray hover:text-daidong-red'}`}
          >
            <FaHeart size={16} />
          </button>
          <Link to={`/product/${product.id}`} className="bg-daidong-white w-10 h-10 flex items-center justify-center rounded-full text-daidong-gray hover:text-daidong-black shadow-md hover:shadow-lg transition-all">
            <FaEye size={16} />
          </Link>
        </div>

        {/* Alternate Image on Hover (Simulated) */}
        <div className="absolute inset-0 bg-daidong-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10 pointer-events-none"></div>

        <div className="absolute bottom-4 left-4 right-4 z-20">
          <button 
            onClick={() => handleProtectedAction('thêm vào giỏ hàng', () => addToCart(product))}
            className="w-full bg-daidong-black text-daidong-white rounded-full py-3.5 uppercase text-xs font-bold tracking-wider translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-daidong-red shadow-lg"
          >
            {t('shop.add_to_cart')}
          </button>
        </div>
      </div>

      <div className="text-center px-4">
        <div className="flex justify-center items-center mb-2 gap-1 text-daidong-gray text-xs">
          <FaStar className="text-daidong-red" />
          <span className="font-bold">{product.rating || "5.0"}</span>
          <span>({product.reviews || Math.floor(Math.random() * 50) + 10})</span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-xl mb-2 text-daidong-black group-hover:text-daidong-red transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-center gap-3 mb-4">
          {product.originalPrice && (
            <p className="text-daidong-gray line-through text-sm font-medium">${product.originalPrice}</p>
          )}
          <p className="text-daidong-red font-bold text-lg">${product.price}</p>
        </div>

        {/* Color Swatches */}
        {product.colors && (
          <div className="flex justify-center gap-2">
            {product.colors.map((color, i) => (
              <div key={i} className={`w-4 h-4 rounded-full border border-daidong-border shadow-sm cursor-pointer ${i === 0 ? 'ring-2 ring-offset-2 ring-daidong-black' : ''}`} style={{ backgroundColor: color }}></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;