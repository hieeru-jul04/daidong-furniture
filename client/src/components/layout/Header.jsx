import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes, FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import useToggle from '../../hooks/useToggle';
import { authApi } from '../../services/auth.api';
import Logo from '../shared/Logo';
import { useShop } from '../../contexts/ShopContext';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { value: isMenuOpen, toggle: toggleMenu } = useToggle();
  const { t, i18n } = useTranslation();
  const { cart, wishlist, removeFromCart, getCartTotal } = useShop();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("token");
      window.location.href = '/login';
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-daidong-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo
            className={scrolled ? 'text-daidong-black' : 'text-daidong-white md:text-daidong-white text-daidong-black'}
            textClassName="text-3xl"
          />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`uppercase text-sm font-semibold tracking-wider transition-colors duration-300 hover:text-daidong-red ${scrolled ? 'text-daidong-dark-gray' : 'text-daidong-white'}`}>{t('header.home')}</Link>
            <Link to="/shop" className={`uppercase text-sm font-semibold tracking-wider transition-colors duration-300 hover:text-daidong-red ${scrolled ? 'text-daidong-dark-gray' : 'text-daidong-white'}`}>{t('header.shop')}</Link>
            <Link to="/about" className={`uppercase text-sm font-semibold tracking-wider transition-colors duration-300 hover:text-daidong-red ${scrolled ? 'text-daidong-dark-gray' : 'text-daidong-white'}`}>{t('header.about')}</Link>
            <Link to="/contact" className={`uppercase text-sm font-semibold tracking-wider transition-colors duration-300 hover:text-daidong-red ${scrolled ? 'text-daidong-dark-gray' : 'text-daidong-white'}`}>{t('header.contact')}</Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-6">
            {/* Language Switcher */}
            <div className="relative group hidden md:flex items-center">
              <button className={`flex items-center cursor-pointer transition-colors duration-300 hover:text-daidong-red ${scrolled ? 'text-daidong-dark-gray' : 'text-daidong-white'}`}>
                <FaGlobe size={18} className="mr-1" />
                <span className="uppercase text-sm font-bold">{i18n.language}</span>
              </button>
              <div className="absolute top-full right-0 mt-4 w-24 bg-daidong-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                <button onClick={() => changeLanguage('en')} className="block cursor-pointer w-full text-left px-4 py-3 text-sm text-daidong-dark-gray font-semibold hover:bg-daidong-red hover:text-daidong-white transition-colors">EN</button>
                <button onClick={() => changeLanguage('vi')} className="block cursor-pointer w-full text-left px-4 py-3 text-sm text-daidong-dark-gray font-semibold hover:bg-daidong-red hover:text-daidong-white transition-colors">VI</button>
              </div>
            </div>

            <button className={`transition-colors cursor-pointer duration-300 hover:text-daidong-red hidden md:block ${scrolled ? 'text-daidong-dark-gray' : 'text-daidong-white'}`}>
              <FaSearch size={20} />
            </button>
            {/* Wishlist Popover */}
            <div className="relative group">
              <Link to="#" className={`cursor-pointer transition-colors duration-300 hover:text-daidong-red relative flex items-center ${scrolled ? 'text-daidong-dark-gray' : 'text-daidong-white'}`}>
                <FaHeart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-daidong-red text-daidong-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              {/* Dropdown Content */}
              <div className="absolute right-0 mt-4 w-80 bg-daidong-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden border border-daidong-border">
                <div className="h-4 w-full absolute -top-4 left-0 bg-transparent"></div>
                <div className="p-4 border-b border-daidong-border bg-daidong-light-gray">
                  <h3 className="text-sm font-bold text-daidong-dark-gray uppercase tracking-wider">Mục yêu thích ({wishlist.length})</h3>
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {wishlist.length === 0 ? (
                    <div className="p-6 text-center text-sm text-daidong-gray font-medium">Chưa có sản phẩm yêu thích</div>
                  ) : (
                    wishlist.map(item => (
                      <Link key={item.id} to={`/product/${item.id}`} className="flex items-center gap-3 p-3 hover:bg-daidong-light-gray transition-colors border-b border-daidong-border last:border-0">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-daidong-black truncate group-hover/link:text-daidong-red transition-colors">{item.name}</p>
                          <p className="text-xs text-daidong-red font-bold">${item.price}</p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Cart Popover */}
            <div className="relative group">
              <Link to="/cart" className={`transition-colors cursor-pointer duration-300 hover:text-daidong-red relative flex items-center ${scrolled ? 'text-daidong-dark-gray' : 'text-daidong-white'}`}>
                <FaShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-daidong-red text-daidong-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </Link>
              {/* Dropdown Content */}
              <div className="absolute right-0 mt-4 w-80 bg-daidong-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden border border-daidong-border">
                <div className="h-4 w-full absolute -top-4 left-0 bg-transparent"></div>
                <div className="p-4 border-b border-daidong-border bg-daidong-light-gray">
                  <h3 className="text-sm font-bold text-daidong-dark-gray uppercase tracking-wider">Giỏ hàng ({cart.reduce((t, i) => t + i.quantity, 0)} sản phẩm)</h3>
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {cart.length === 0 ? (
                    <div className="p-6 text-center text-sm text-daidong-gray font-medium">Giỏ hàng trống</div>
                  ) : (
                    cart.map(item => (
                      <div key={item.cartKey} className="flex items-center gap-3 p-3 hover:bg-daidong-light-gray transition-colors border-b border-daidong-border last:border-0">
                        <Link to={`/product/${item.id}`} className="shrink-0">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${item.id}`} className="text-sm font-bold text-daidong-black truncate block hover:text-daidong-red transition-colors">{item.name}</Link>
                          {item.variant && <p className="text-[10px] text-gray-400">{item.variant.name}</p>}
                          <p className="text-xs text-daidong-red font-bold">${item.price} <span className="text-daidong-gray text-[10px]">x{item.quantity}</span></p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); removeFromCart(item.cartKey); }} className="p-2 text-daidong-gray hover:text-daidong-red transition-colors">
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                {cart.length > 0 && (
                  <div className="p-4 bg-daidong-white border-t border-daidong-border">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-daidong-gray font-bold uppercase">Tổng tiền:</span>
                      <span className="text-lg text-daidong-red font-bold">${getCartTotal().toFixed(2)}</span>
                    </div>
                    <Link to="/cart" className="block w-full text-center bg-daidong-black text-daidong-white py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-daidong-red transition-colors shadow-md">
                      Xem Giỏ Hàng
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="relative group">
              <Link to="/profile" className={`transition-colors duration-300 hover:text-daidong-red ${scrolled ? 'text-daidong-dark-gray' : 'text-daidong-white'}`}>
                <FaUser size={20} />
              </Link>
              <div className="absolute right-0 mt-4 w-40 bg-daidong-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                <div className="h-4 w-full absolute -top-4 left-0"></div>
                {isLoggedIn ? (
                  <>
                    <Link to="/profile" className="block px-4 py-3 text-sm text-daidong-dark-gray font-semibold hover:bg-daidong-red hover:text-daidong-white transition-colors">Hồ sơ</Link>
                    <Link to="/order-history" className="block px-4 py-3 text-sm text-daidong-dark-gray font-semibold hover:bg-daidong-red hover:text-daidong-white transition-colors">Đơn hàng</Link>
                    <button onClick={handleLogout} className="block cursor-pointer w-full text-left px-4 py-3 text-sm text-daidong-dark-gray font-semibold hover:bg-daidong-red hover:text-daidong-white transition-colors">Đăng xuất</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-3 text-sm text-daidong-dark-gray font-semibold hover:bg-daidong-red hover:text-daidong-white transition-colors">Đăng nhập</Link>
                    <Link to="/register" className="block px-4 py-3 text-sm text-daidong-dark-gray font-semibold hover:bg-daidong-red hover:text-daidong-white transition-colors">Đăng ký</Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className={`md:hidden transition-colors duration-300 hover:text-daidong-red ${scrolled ? 'text-daidong-dark-gray' : 'text-daidong-black'}`}
              onClick={toggleMenu}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 bg-daidong-white absolute left-0 w-full px-6 shadow-xl z-40 rounded-b-2xl mt-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-daidong-dark-gray hover:text-daidong-red uppercase text-sm font-bold transition-colors" onClick={toggleMenu}>{t('header.home')}</Link>
              <Link to="/shop" className="text-daidong-dark-gray hover:text-daidong-red uppercase text-sm font-bold transition-colors" onClick={toggleMenu}>{t('header.shop')}</Link>
              <Link to="/about" className="text-daidong-dark-gray hover:text-daidong-red uppercase text-sm font-bold transition-colors" onClick={toggleMenu}>{t('header.about')}</Link>
              <Link to="/contact" className="text-daidong-dark-gray hover:text-daidong-red uppercase text-sm font-bold transition-colors" onClick={toggleMenu}>{t('header.contact')}</Link>

              <div className="flex space-x-3 pt-4 border-t border-daidong-border">
                <button onClick={() => { changeLanguage('en'); toggleMenu(); }} className={`px-4 py-2 rounded-full font-bold text-xs ${i18n.language === 'en' ? 'bg-daidong-red text-daidong-white' : 'bg-daidong-light-gray text-daidong-dark-gray'}`}>EN</button>
                <button onClick={() => { changeLanguage('vi'); toggleMenu(); }} className={`px-4 py-2 rounded-full font-bold text-xs ${i18n.language === 'vi' ? 'bg-daidong-red text-daidong-white' : 'bg-daidong-light-gray text-daidong-dark-gray'}`}>VI</button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
