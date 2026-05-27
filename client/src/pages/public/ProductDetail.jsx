import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaStar, FaTruck, FaShieldAlt, FaSyncAlt, FaMinus, FaPlus, FaChevronRight, FaSpinner } from 'react-icons/fa';
import { useShop } from '../../contexts/ShopContext';
import { useProduct } from '../../hooks/useProducts';

const ProductDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const { product, loading, error } = useProduct(id);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantError, setVariantError] = useState(false);

  useEffect(() => { setActiveImage(0); setSelectedVariant(null); setVariantError(false); }, [id]);


  const handleProtectedAction = (actionName, callback) => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (!isLoggedIn) {
      alert(`Vui lòng đăng nhập để ${actionName}!`);
      navigate('/login');
      return;
    }
    callback();
  };

  const handleAddToCart = () => {
    // If product has variants, user must select one
    if (product.variants?.length > 0 && !selectedVariant) {
      setVariantError(true);
      document.getElementById('variant-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    handleProtectedAction('thêm vào giỏ hàng', () => addToCart(product, quantity, selectedVariant));
  };

  const handleQuantity = (type) => {
    if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
    if (type === 'inc') setQuantity(quantity + 1);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-daidong-light-gray">
      <FaSpinner className="animate-spin text-daidong-red text-5xl" />
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-daidong-light-gray gap-4">
      <p className="text-2xl font-bold text-daidong-black">Không tìm thấy sản phẩm</p>
      <Link to="/shop" className="text-daidong-red font-bold hover:underline">Quay lại cửa hàng</Link>
    </div>
  );


  return (
    <div className="bg-daidong-white min-h-screen pb-16">
      {/* Dark Header Banner */}
      <div className="bg-daidong-black pt-32 pb-12 rounded-b-[3rem] mb-12 shadow-lg">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-daidong-gray">
            <Link to="/" className="hover:text-daidong-white transition-colors">{t('header.home')}</Link>
            <FaChevronRight className="mx-2 text-[10px]" />
            <Link to="/shop" className="hover:text-daidong-white transition-colors">{t('header.shop')}</Link>
            <FaChevronRight className="mx-2 text-[10px]" />
            <span className="text-daidong-white font-bold">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">

        <div className="flex flex-col lg:flex-row gap-16 mb-24">
          {/* Product Images */}
          <div className="w-full lg:w-1/2 flex flex-col md:flex-row-reverse gap-4">
            <div className="w-full md:w-5/6 relative bg-daidong-light-gray rounded-[2rem] overflow-hidden shadow-sm h-[400px] md:h-[600px]">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              {product.originalPrice && (
                <div className="absolute top-6 left-6 bg-daidong-red text-daidong-white px-4 py-1.5 text-xs uppercase tracking-widest font-bold rounded-full shadow-md z-10">
                  {t('shop.sale')}
                </div>
              )}
            </div>
            <div className="w-full md:w-1/6 flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`flex-shrink-0 w-24 md:w-full h-24 md:h-32 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-daidong-red opacity-100 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-2 uppercase text-xs font-bold tracking-widest text-daidong-gray">
              {product.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-daidong-black mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-daidong-red">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={18} className={i < Math.floor(product.rating) ? 'fill-current' : 'text-daidong-gray'} />
                ))}
              </div>
              <span className="font-bold text-daidong-black">{product.rating}</span>
              <span className="text-daidong-gray font-medium">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold text-daidong-red">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-daidong-gray line-through font-medium">${product.originalPrice}</span>
              )}
            </div>

            <p className="text-daidong-gray font-medium leading-relaxed mb-10 text-lg">
              {product.description}
            </p>

            {/* Variants Selector */}
            {product.variants?.length > 0 && (
              <div id="variant-section" className={`border-t border-daidong-border pt-8 mb-8 ${variantError ? 'animate-pulse' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold uppercase tracking-wider text-sm">Phân loại</h3>
                  {variantError && <span className="text-red-500 text-xs font-bold">⚠ Vui lòng chọn phân loại!</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, idx) => {
                    const outOfStock = variant.stock === 0;
                    const isSelected = selectedVariant?._id === variant._id || selectedVariant?.name === variant.name;
                    return (
                      <button
                        key={idx}
                        disabled={outOfStock}
                        onClick={() => { setSelectedVariant(variant); setVariantError(false); }}
                        className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all duration-200
                          ${outOfStock
                            ? 'border-gray-200 text-gray-300 line-through cursor-not-allowed'
                            : isSelected
                              ? 'border-daidong-black bg-daidong-black text-white shadow-md'
                              : 'border-gray-300 text-gray-700 hover:border-daidong-black hover:shadow-sm'
                          }`}
                        title={outOfStock ? 'Hết hàng' : variant.name}
                      >
                        {variant.name}
                        {outOfStock && <span className="ml-1 text-[10px] font-normal">(Hết)</span>}
                      </button>
                    );
                  })}
                </div>
                {selectedVariant && (
                  <p className="text-xs text-gray-500 mt-3">
                    Đã chọn: <span className="font-bold text-daidong-black">{selectedVariant.name}</span>
                    <span className="ml-2 text-green-600">({selectedVariant.stock} còn lại)</span>
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 mb-12 mt-auto">
              {/* Quantity Selector */}
              <div className="flex items-center bg-daidong-light-gray rounded-full px-6 py-4 w-full md:w-1/3">
                <button onClick={() => handleQuantity('dec')} className="text-daidong-gray hover:text-daidong-red p-2 transition-colors">
                  <FaMinus size={12} />
                </button>
                <span className="flex-1 text-center font-bold text-daidong-black text-lg">{quantity}</span>
                <button onClick={() => handleQuantity('inc')} className="text-daidong-gray hover:text-daidong-red p-2 transition-colors">
                  <FaPlus size={12} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="bg-daidong-black text-daidong-white rounded-full py-4 px-8 uppercase font-bold tracking-wider w-full md:w-2/3 hover:bg-daidong-red transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('shop.add_to_cart')}
              </button>

              <button
                onClick={() => handleProtectedAction('thêm vào yêu thích', () => toggleWishlist(product))}
                className={`rounded-full w-14 h-14 md:w-auto md:px-6 flex items-center justify-center shadow-sm hover:shadow-md transition-all flex-shrink-0 ${wishlist.some(item => item.id === product.id) ? 'bg-daidong-red text-daidong-white' : 'bg-daidong-light-gray text-daidong-gray hover:text-daidong-red hover:bg-white'}`}
              >
                <FaHeart size={20} />
              </button>
            </div>

            {/* Service Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-daidong-border">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="bg-daidong-light-gray p-3 rounded-full text-daidong-black">
                  <FaTruck size={18} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-daidong-gray">{t('home.services.shipping')}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="bg-daidong-light-gray p-3 rounded-full text-daidong-black">
                  <FaShieldAlt size={18} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-daidong-gray">{t('home.services.payment')}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="bg-daidong-light-gray p-3 rounded-full text-daidong-black">
                  <FaSyncAlt size={18} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-daidong-gray">{t('home.services.returns')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-20">
          <div className="flex justify-center border-b border-daidong-border mb-10">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-8 py-4 font-bold uppercase tracking-wider text-sm transition-colors border-b-2 ${activeTab === 'description' ? 'border-daidong-red text-daidong-red' : 'border-transparent text-daidong-gray hover:text-daidong-black'}`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-8 py-4 font-bold uppercase tracking-wider text-sm transition-colors border-b-2 ${activeTab === 'reviews' ? 'border-daidong-red text-daidong-red' : 'border-transparent text-daidong-gray hover:text-daidong-black'}`}
            >
              Reviews ({product.reviews})
            </button>
          </div>

          <div className="max-w-4xl mx-auto min-h-[200px]">
            {activeTab === 'description' && (
              <div className="text-daidong-gray font-medium leading-relaxed text-lg space-y-6 animate-fade-in">
                <p>{product.description}</p>
                <p>Designed with both aesthetics and functionality in mind, this piece serves as the perfect addition to any modern home. The meticulous craftsmanship is evident in every detail, from the reinforced frame to the perfectly tailored upholstery.</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="animate-fade-in text-center py-10">
                <div className="text-6xl font-bold text-daidong-black mb-4">{product.rating}</div>
                <div className="flex justify-center text-daidong-red mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={24} className={i < Math.floor(product.rating) ? 'fill-current' : 'text-daidong-light-gray'} />
                  ))}
                </div>
                <p className="text-daidong-gray font-medium mb-8">Based on {product.reviews} reviews</p>
                <button className="bg-daidong-black text-daidong-white px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-daidong-red transition-colors">
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
