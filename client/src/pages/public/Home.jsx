import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/shared/ProductCard';
import { FaHeart, FaStar, FaTruck, FaShieldAlt, FaSyncAlt, FaHeadphones, FaBox, FaPlay, FaSpinner, FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useProducts } from '../../hooks/useProducts';
import { categoryApi } from '../../services/category.api';

// Fallback images cycle through for categories without images
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=500&q=80',
];

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { t } = useTranslation();
  const [apiCategories, setApiCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const { products: newProducts, loading: loadingNew } = useProducts({ limit: 6 });
  const { products: bestsellers, loading: loadingBest } = useProducts({ limit: 3 });

  useEffect(() => {
    categoryApi.getAll()
      .then(res => setApiCategories(res.data))
      .catch(() => {})
      .finally(() => setLoadingCats(false));
  }, []);

  const filteredProducts = activeCategory === 'All'
    ? newProducts
    : newProducts.filter(product => product.category === activeCategory);

  return (
    <div className="min-h-screen bg-daidong-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative container mx-auto px-6 text-center text-daidong-white mt-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight max-w-4xl mx-auto">
            {t('home.hero_title')}
          </h1>
          <p className="text-lg md:text-xl mb-12 font-medium leading-relaxed max-w-2xl mx-auto opacity-90">
            {t('home.hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/shop" className="bg-daidong-red text-daidong-white px-10 py-4 font-bold uppercase tracking-wider text-sm rounded-full hover:bg-daidong-red-dark transition-all duration-300 shadow-lg transform hover:-translate-y-1">
              {t('home.shop_now')}
            </Link>
            <Link to="/about" className="bg-daidong-white text-daidong-black px-10 py-4 font-bold uppercase tracking-wider text-sm rounded-full hover:bg-daidong-light-gray transition-all duration-300 shadow-lg transform hover:-translate-y-1">
              {t('home.explore')}
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Categories */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-daidong-black mb-4">{t('home.categories')}</h2>
          <div className="w-16 h-1 bg-daidong-red mx-auto rounded-full"></div>
        </div>

        {loadingCats ? (
          <div className="flex justify-center py-16">
            <FaSpinner className="animate-spin text-daidong-red text-4xl" />
          </div>
        ) : apiCategories.length === 0 ? (
          <div className="text-center text-daidong-gray py-12">
            <p className="font-medium">Chưa có danh mục nào. Hãy thêm danh mục trong trang Admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {apiCategories.map((category, index) => (
              <Link
                key={category._id}
                to={`/shop?category=${category._id}`}
                className="group cursor-pointer block"
              >
                <div className="overflow-hidden rounded-3xl mb-6 relative shadow-lg">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-all duration-500 z-10 pointer-events-none"></div>
                  <img
                    src={category.image ? `${BASE_URL}${category.image}` : FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                    alt={category.name}
                    className="w-full h-80 md:h-96 object-cover group-hover:scale-110 transition duration-700 ease-in-out"
                  />
                  <div className="absolute bottom-6 left-0 w-full text-center z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="bg-daidong-white text-daidong-black px-6 py-2 rounded-full font-bold uppercase text-xs shadow-md inline-flex items-center gap-2">
                      Xem bộ sưu tập <FaArrowRight size={10} />
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-xl text-center text-daidong-black group-hover:text-daidong-red transition-colors duration-300">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-daidong-gray text-center mt-1 line-clamp-1">{category.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* New Products */}
      <section className="py-24 bg-daidong-light-gray rounded-[3rem] mx-4 md:mx-10 mb-24 px-6 md:px-12">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-daidong-black mb-4">{t('home.new_products')}</h2>
            <div className="w-16 h-1 bg-daidong-red mx-auto rounded-full"></div>
          </div>
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              {['All', 'Chairs', 'Sofas', 'Armchairs', 'Tables', 'Stools'].map((category) => {
                const categoryKey = category.toLowerCase();
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-sm ${activeCategory === category ? 'bg-daidong-red text-daidong-white' : 'bg-daidong-white text-daidong-gray hover:text-daidong-black hover:shadow-md'}`}
                  >
                    {t(`home.${categoryKey}`)}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
             <Link to="/shop" className="inline-block bg-daidong-black text-daidong-white px-8 py-3 rounded-full font-bold uppercase text-sm tracking-wider hover:bg-daidong-red transition-colors duration-300 shadow-md">
                View All Products
             </Link>
          </div>
        </div>
      </section>

      {/* Video Section / Story */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <div className="relative overflow-hidden rounded-[2rem] group cursor-pointer shadow-2xl">
              <img src="https://images.unsplash.com/photo-1618220179428-22790b46a015?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Interior Design" className="w-full h-96 lg:h-[32rem] object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-all duration-300">
                <button className="bg-daidong-red text-daidong-white rounded-full w-20 h-20 flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all duration-300">
                  <FaPlay size={24} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-daidong-black leading-tight">
              {t('home.affordable_title')}
            </h2>
            <p className="text-daidong-gray text-lg font-medium leading-relaxed mb-6">
              {t('home.affordable_desc1')}
            </p>
            <p className="text-daidong-gray text-lg font-medium leading-relaxed mb-10">
              {t('home.affordable_desc2')}
            </p>
            <Link to="/about" className="inline-flex items-center text-daidong-red font-bold uppercase tracking-wider text-sm hover:text-daidong-red-dark transition-colors group">
              Discover Our Story
              <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-24 bg-daidong-black text-daidong-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('home.bestsellers')}</h2>
            <div className="w-16 h-1 bg-daidong-red mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-daidong-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-daidong-light-gray rounded-full flex items-center justify-center mb-6 text-daidong-red group-hover:bg-daidong-red group-hover:text-daidong-white transition-colors duration-300">
                <FaTruck size={28} />
              </div>
              <h3 className="font-bold text-daidong-black">{t('home.services.shipping')}</h3>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-daidong-light-gray rounded-full flex items-center justify-center mb-6 text-daidong-red group-hover:bg-daidong-red group-hover:text-daidong-white transition-colors duration-300">
                <FaShieldAlt size={28} />
              </div>
              <h3 className="font-bold text-daidong-black">{t('home.services.payment')}</h3>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-daidong-light-gray rounded-full flex items-center justify-center mb-6 text-daidong-red group-hover:bg-daidong-red group-hover:text-daidong-white transition-colors duration-300">
                <FaSyncAlt size={28} />
              </div>
              <h3 className="font-bold text-daidong-black">{t('home.services.returns')}</h3>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-daidong-light-gray rounded-full flex items-center justify-center mb-6 text-daidong-red group-hover:bg-daidong-red group-hover:text-daidong-white transition-colors duration-300">
                <FaHeadphones size={28} />
              </div>
              <h3 className="font-bold text-daidong-black">{t('home.services.support')}</h3>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-daidong-light-gray rounded-full flex items-center justify-center mb-6 text-daidong-red group-hover:bg-daidong-red group-hover:text-daidong-white transition-colors duration-300">
                <FaBox size={28} />
              </div>
              <h3 className="font-bold text-daidong-black">{t('home.services.quality')}</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;