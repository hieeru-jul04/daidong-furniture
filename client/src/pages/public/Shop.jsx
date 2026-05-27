import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { FaHeart, FaFilter, FaStar, FaShieldAlt, FaSyncAlt, FaHeadphones, FaCreditCard, FaChevronDown, FaThLarge, FaList, FaSearch, FaEye, FaCheck, FaSpinner } from 'react-icons/fa';
import ProductCard from '../../components/shared/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { categoryApi } from '../../services/category.api';

const Shop = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState({ name: 'Tất cả', _id: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [apiCategories, setApiCategories] = useState([]);

  const { products, loading, pagination } = useProducts({
    search: searchQuery,
    categoryId: selectedCategory._id,
    page: currentPage,
    limit: 12
  });

  useEffect(() => {
    categoryApi.getAll().then(res => {
      const cats = res.data;
      setApiCategories(cats);
      // If URL has ?category=<id>, pre-select it
      const paramId = searchParams.get('category');
      if (paramId) {
        const match = cats.find(c => c._id === paramId);
        if (match) setSelectedCategory(match);
      }
    }).catch(() => {});
  }, []);

  const allCategories = [{ name: 'Tất cả', _id: '' }, ...apiCategories];

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-daidong-light-gray">
      {/* Hero Section with Image Background */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-daidong-black">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Shop Hero" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-daidong-black to-transparent opacity-80"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center text-daidong-white">
          <span className="bg-daidong-red text-daidong-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block shadow-lg">{t('shop.new_collection')}</span>
          <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-md">{t('shop.title')}</h1>
          <p className="text-lg md:text-xl font-medium text-daidong-light-gray max-w-2xl mx-auto opacity-90">
            {t('shop.subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Top Control Bar */}
        <div className="bg-daidong-white rounded-[2rem] p-4 md:p-6 mb-12 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative z-20 -mt-20">
          {/* Categories Horizontal */}
          <div className="flex-1 overflow-x-auto w-full hide-scrollbar">
            <div className="flex space-x-2 min-w-max pb-2 md:pb-0">
                {allCategories.map((cat) => (
                  <button
                    key={cat._id || 'all'}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center space-x-2 ${
                      selectedCategory._id === cat._id
                        ? 'bg-daidong-red text-daidong-white shadow-md transform -translate-y-0.5'
                        : 'bg-daidong-light-gray text-daidong-gray hover:bg-daidong-black hover:text-daidong-white'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
            </div>
          </div>

          <div className="w-full md:w-px h-px md:h-12 bg-daidong-border mx-2"></div>

          {/* Search & Sort */}
            <form onSubmit={handleSearch} className="flex items-center justify-between w-full md:w-auto gap-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-daidong-gray group-hover:text-daidong-red transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder={t('shop.search')}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="bg-daidong-light-gray border-none rounded-full py-2.5 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-daidong-red w-48 md:w-64 transition-all outline-none"
                />
              </div>
            </form>
        </div>

        <div>
          {/* Product Grid Area */}
          <div className="w-full">
            {/* Results Info & View Toggle */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-daidong-gray font-medium">{t('shop.showing')} <span className="font-bold text-daidong-black">{products.length}</span> {t('shop.of')} <span className="font-bold text-daidong-black">{pagination.total}</span> {t('shop.products')}</p>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-daidong-gray uppercase tracking-wider">{t('shop.sort_by')}:</span>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-daidong-white border-none rounded-full py-2 px-4 text-sm font-bold text-daidong-black focus:ring-2 focus:ring-daidong-red shadow-sm cursor-pointer outline-none"
                  >
                    <option value="featured">{t('shop.sort_featured')}</option>
                    <option value="newest">{t('shop.sort_newest')}</option>
                    <option value="price-low">{t('shop.sort_price_low')}</option>
                    <option value="price-high">{t('shop.sort_price_high')}</option>
                  </select>
                </div>
                
                <div className="hidden md:flex bg-daidong-white rounded-full p-1 shadow-sm">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-daidong-black text-daidong-white' : 'text-daidong-gray hover:text-daidong-black'}`}
                  >
                    <FaThLarge size={16} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-daidong-black text-daidong-white' : 'text-daidong-gray hover:text-daidong-black'}`}
                  >
                    <FaList size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
              {loading ? (
                <div className="col-span-3 py-20 flex justify-center">
                  <FaSpinner className="animate-spin text-daidong-red text-4xl" />
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-3 py-20 text-center text-daidong-gray font-medium">Không tìm thấy sản phẩm nào.</div>
              ) : (
                products.map((product, index) => (
                  <React.Fragment key={product.id}>
                    {index === 4 && viewMode === 'grid' && (
                      <div className="col-span-1 sm:col-span-2 lg:col-span-4 bg-daidong-red rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between text-daidong-white shadow-xl relative overflow-hidden my-4 group">
                        <div className="absolute inset-0 bg-daidong-black opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                        <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
                          <span className="text-daidong-white uppercase tracking-widest text-xs font-bold mb-2 block opacity-80">{t('shop.promo_tag')}</span>
                          <h3 className="text-3xl md:text-4xl font-bold mb-4">{t('shop.promo_title')}</h3>
                          <p className="font-medium opacity-90 max-w-lg">{t('shop.promo_desc')}</p>
                        </div>
                        <div className="relative z-10 w-full md:w-auto">
                          <button className="w-full md:w-auto bg-daidong-black text-daidong-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm shadow-lg hover:bg-daidong-white hover:text-daidong-red transition-all duration-300 transform hover:-translate-y-1">
                            {t('shop.promo_btn')}
                          </button>
                        </div>
                      </div>
                    )}
                    <ProductCard product={product} viewMode={viewMode} />
                  </React.Fragment>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-16 pt-10 border-t border-daidong-border">
                <div className="flex items-center space-x-2">
                  <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-daidong-white text-daidong-gray font-bold shadow-sm hover:text-daidong-black hover:shadow-md transition-all duration-300 disabled:opacity-40">
                    {t('shop.prev')}
                  </button>
                  <div className="flex space-x-2 px-4">
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-sm transition-all duration-300 ${
                        currentPage === i + 1 ? 'bg-daidong-red text-daidong-white shadow-md' : 'bg-daidong-white text-daidong-black hover:bg-daidong-light-gray hover:shadow-md'
                      }`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button disabled={currentPage >= pagination.totalPages} onClick={() => setCurrentPage(p => p + 1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-daidong-white text-daidong-black font-bold shadow-sm hover:text-daidong-red hover:shadow-md transition-all duration-300 disabled:opacity-40">
                    {t('shop.next')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      {/* <div className="bg-daidong-black text-daidong-white py-24 mt-12 rounded-t-[4rem]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-daidong-dark-gray rounded-full flex items-center justify-center mb-8 text-daidong-red group-hover:bg-daidong-red group-hover:text-daidong-white transition-colors duration-300">
                <FaCreditCard size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 tracking-wide">{t('home.services.payment')}</h3>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-daidong-dark-gray rounded-full flex items-center justify-center mb-8 text-daidong-red group-hover:bg-daidong-red group-hover:text-daidong-white transition-colors duration-300">
                <FaSyncAlt size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 tracking-wide">{t('home.services.returns')}</h3>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-daidong-dark-gray rounded-full flex items-center justify-center mb-8 text-daidong-red group-hover:bg-daidong-red group-hover:text-daidong-white transition-colors duration-300">
                <FaHeadphones size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 tracking-wide">{t('home.services.support')}</h3>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Shop;