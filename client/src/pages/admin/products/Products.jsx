import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaFilter, FaImage, FaTags, FaUpload, FaSpinner, FaTimes } from 'react-icons/fa';
import { productApi } from '../../../services/product.api';
import { categoryApi } from '../../../services/category.api';
import ConfirmModal from '../../../components/shared/ConfirmModal';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const emptyForm = {
  _id: null, name: '', sku: '', category: '', price: '', originalPrice: '',
  stock: '', status: 'Active', description: '', images: [], variants: []
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });

  // Modal sản phẩm
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  // Modal danh mục
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCat, setEditingCat] = useState(null);
  const [catSaving, setCatSaving] = useState(false);
  const [categoryImageFile, setCategoryImageFile] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState(null);

  // Modal Confirm
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // --- Fetch dữ liệu ---
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page };
      if (searchTerm) params.search = searchTerm;
      if (categoryFilter) params.category = categoryFilter;
      const res = await productApi.getAll(params);
      setProducts(res.data.products);
      setPagination(p => ({ ...p, total: res.data.total, totalPages: res.data.totalPages }));
    } catch (err) {
      console.error('Lỗi tải sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryFilter, pagination.page]);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data);
    } catch (err) {
      console.error('Lỗi tải danh mục:', err);
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // --- Handlers Sản phẩm ---
  const handleAddClick = () => {
    setFormData({ ...emptyForm, category: categories.length > 0 ? categories[0]._id : '' });
    setIsEditing(false);
    setImageFiles([]);
    setImagePreview([]);
    setIsModalOpen(true);
  };

  const handleEditClick = (product) => {
    setFormData({
      _id: product._id,
      name: product.name,
      sku: product.sku,
      category: product.category?._id || '',
      price: product.price,
      originalPrice: product.originalPrice || '',
      stock: product.stock,
      status: product.status,
      description: product.description || '',
      images: product.images || [],
      variants: product.variants || []
    });
    setIsEditing(true);
    setImageFiles([]);
    setImagePreview([]);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setIsDeleteProductModalOpen(true);
  };

  const handleDeleteProductConfirm = async () => {
    if (!productToDelete) return;
    try {
      await productApi.delete(productToDelete);
      fetchProducts();
      setIsDeleteProductModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Xóa sản phẩm thất bại');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setImagePreview(files.map(f => URL.createObjectURL(f)));
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImageFile(file);
      setCategoryImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.sku || !formData.category) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc (*)');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('sku', formData.sku);
      fd.append('category', formData.category);
      fd.append('price', formData.price);
      fd.append('originalPrice', formData.originalPrice || '');
      fd.append('stock', formData.stock || 0);
      fd.append('status', formData.status);
      fd.append('description', formData.description);
      imageFiles.forEach(f => fd.append('images', f));
      // Append variants as JSON
      fd.append('variants', JSON.stringify(formData.variants || []));


      if (isEditing) {
        fd.append('keepImages', 'true');
        await productApi.update(formData._id, fd);
      } else {
        await productApi.create(fd);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Lưu sản phẩm thất bại');
    } finally {
      setSaving(false);
    }
  };

  // --- Handlers Variants ---
  const handleAddVariant = () => {
    setFormData(prev => ({ ...prev, variants: [...prev.variants, { name: '', stock: 0 }] }));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = formData.variants.map((v, i) => i === index ? { ...v, [field]: value } : v);
    setFormData(prev => ({ ...prev, variants: updated }));
  };

  const handleRemoveVariant = (index) => {
    setFormData(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  };

  // --- Handlers Danh mục ---
  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) return;
    setCatSaving(true);
    try {
      if (editingCat) {
        const fd = new FormData();
        fd.append('name', newCategoryName);
        if (categoryImageFile) {
          fd.append('image', categoryImageFile);
        }
        await categoryApi.update(editingCat._id, fd);
        setEditingCat(null);
      } else {
        const fd = new FormData();
        fd.append('name', newCategoryName);
        if (categoryImageFile) {
          fd.append('image', categoryImageFile);
        }
        await categoryApi.create(fd);
      }
      setNewCategoryName('');
      setCategoryImageFile(null);
      setCategoryImagePreview(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi lưu danh mục');
    } finally {
      setCatSaving(false);
    }
  };

  const handleEditCategory = (cat) => {
    setEditingCat(cat);
    setNewCategoryName(cat.name);
    setCategoryImageFile(null);
    setCategoryImagePreview(cat.image ? `${BASE_URL}${cat.image}` : null);
  };

  const handleDeleteCategory = (id) => {
    setCategoryToDelete(id);
    setIsDeleteCategoryModalOpen(true);
  };

  const handleDeleteCategoryConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await categoryApi.delete(categoryToDelete);
      fetchCategories();
      setIsDeleteCategoryModalOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Xóa danh mục thất bại');
    }
  };

  const getImageSrc = (img) => img?.startsWith('http') ? img : `${BASE_URL}${img}`;

  const statusStyle = (s) => s === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : s === 'Out of Stock' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-700 border border-gray-200';
  const statusLabel = (s) => s === 'Active' ? 'Đang bán' : s === 'Out of Stock' ? 'Hết hàng' : 'Bản nháp';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
          <p className="text-gray-500 text-sm mt-1">Tổng cộng: <span className="font-bold text-gray-800">{pagination.total}</span> sản phẩm</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsCatModalOpen(true)} className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
            <FaTags size={14} /> Quản lý danh mục
          </button>
          <button onClick={handleAddClick} className="bg-daidong-black text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-daidong-red transition-colors shadow-sm">
            <FaPlus size={14} /> Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Tìm theo tên hoặc SKU..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-daidong-red focus:border-transparent" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPagination(p => ({ ...p, page: 1 })); }} />
        </div>
        <select className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-daidong-red w-full md:w-auto" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}>
          <option value="">Tất cả danh mục</option>
          {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Giá</th>
                <th className="px-6 py-4">Tồn kho</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-12 text-center"><FaSpinner className="animate-spin mx-auto text-gray-400 text-2xl" /></td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">Không tìm thấy sản phẩm nào.</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                          {product.images?.[0] ? <img src={getImageSrc(product.images[0])} alt={product.name} className="w-full h-full object-cover" /> : <FaImage className="w-full h-full p-2 text-gray-300" />}
                        </div>
                        <span className="font-bold text-gray-900 truncate max-w-[180px]" title={product.name}>{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{product.sku}</td>
                    <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{product.category?.name || '—'}</span></td>
                    <td className="px-6 py-4 text-daidong-red font-bold">${Number(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4"><span className={`font-bold ${product.stock < 10 ? 'text-red-500' : 'text-gray-900'}`}>{product.stock}</span></td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusStyle(product.status)}`}>{statusLabel(product.status)}</span></td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button onClick={() => handleEditClick(product)} className="text-gray-400 hover:text-daidong-black mx-1 transition-colors p-2 hover:bg-gray-100 rounded-lg" title="Sửa"><FaEdit size={16} /></button>
                      <button onClick={() => handleDeleteClick(product._id)} className="text-gray-400 hover:text-daidong-red mx-1 transition-colors p-2 hover:bg-red-50 rounded-lg" title="Xóa"><FaTrash size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <span className="text-sm text-gray-500 font-medium">Hiển thị {products.length} / {pagination.total} sản phẩm</span>
          <div className="flex gap-1">
            <button disabled={pagination.page <= 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} className="px-3 py-1 border border-gray-200 bg-white rounded text-gray-500 hover:bg-gray-50 disabled:opacity-40">Trước</button>
            <span className="px-3 py-1 bg-daidong-black text-white rounded font-medium">{pagination.page}</span>
            <button disabled={pagination.page >= pagination.totalPages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} className="px-3 py-1 border border-gray-200 bg-white rounded text-gray-500 hover:bg-gray-50 disabled:opacity-40">Sau</button>
          </div>
        </div>
      </div>

      {/* MODAL: Thêm/Sửa Sản phẩm */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Cập nhật Sản phẩm' : 'Thêm Sản phẩm mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"><FaTimes /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="productForm" onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tên sản phẩm <span className="text-red-500">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nhập tên sản phẩm..." className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-daidong-black outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mã SKU <span className="text-red-500">*</span></label>
                    <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} placeholder="Ví dụ: CHAIR-001" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-daidong-black outline-none uppercase" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục <span className="text-red-500">*</span></label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-daidong-black outline-none" required>
                      <option value="">-- Chọn --</option>
                      {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Giá (USD) <span className="text-red-500">*</span></label>
                    <input type="number" name="price" min="0" step="0.01" value={formData.price} onChange={handleInputChange} placeholder="0.00" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-daidong-black outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Giá gốc</label>
                    <input type="number" name="originalPrice" min="0" step="0.01" value={formData.originalPrice} onChange={handleInputChange} placeholder="0.00" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-daidong-black outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tồn kho <span className="text-red-500">*</span></label>
                    <input type="number" name="stock" min="0" value={formData.stock} onChange={handleInputChange} placeholder="0" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-daidong-black outline-none" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Trạng thái</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-daidong-black outline-none">
                      <option value="Active">Đang bán (Active)</option>
                      <option value="Draft">Bản nháp (Draft)</option>
                      <option value="Out of Stock">Hết hàng (Out of Stock)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tải ảnh lên</label>
                    <div className="relative w-full">
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-between text-gray-500 hover:bg-gray-100 transition-colors">
                        <span>{imageFiles.length > 0 ? `${imageFiles.length} ảnh đã chọn` : 'Chọn ảnh (tối đa 5 ảnh)...'}</span>
                        <FaUpload />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả sản phẩm</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Nhập mô tả chi tiết..." className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-daidong-black outline-none resize-none"></textarea>
                </div>

                {/* Variants Section */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-800">Phân loại sản phẩm (Variants)</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Ví dụ: Đỏ - Size L, Đen - Size M,...</p>
                    </div>
                    <button type="button" onClick={handleAddVariant} className="flex items-center gap-1.5 px-3 py-2 bg-daidong-black text-white rounded-lg text-sm font-medium hover:bg-daidong-red transition-colors">
                      <FaPlus size={11} /> Thêm phân loại
                    </button>
                  </div>

                  {formData.variants.length === 0 ? (
                    <p className="text-sm text-gray-400 italic text-center py-3">Chưa có phân loại nào. Bấm "Thêm phân loại" để bắt đầu.</p>
                  ) : (
                    <div className="space-y-2">
                      {/* Header row */}
                      <div className="grid grid-cols-12 gap-2 px-1">
                        <span className="col-span-7 text-xs font-bold text-gray-500 uppercase">Tên phân loại</span>
                        <span className="col-span-3 text-xs font-bold text-gray-500 uppercase">Số lượng</span>
                        <span className="col-span-2"></span>
                      </div>
                      {formData.variants.map((variant, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-lg px-2 py-1.5">
                          <input
                            type="text"
                            value={variant.name}
                            onChange={e => handleVariantChange(index, 'name', e.target.value)}
                            placeholder="Ví dụ: Đỏ - Size L"
                            className="col-span-7 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-daidong-black outline-none"
                          />
                          <input
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={e => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                            className="col-span-3 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-daidong-black outline-none"
                          />
                          <div className="col-span-2 flex justify-center">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${variant.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                              {variant.stock > 0 ? 'Còn' : 'Hết'}
                            </span>
                            <button type="button" onClick={() => handleRemoveVariant(index)} className="ml-1 p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded">
                              <FaTimes size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Previews */}
                {(imagePreview.length > 0 || formData.images.length > 0) && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Ảnh sản phẩm</label>
                    <div className="flex flex-wrap gap-3">
                      {formData.images.filter((_, i) => imageFiles.length === 0).map((img, i) => (
                        <img key={i} src={getImageSrc(img)} alt="" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                      ))}
                      {imagePreview.map((src, i) => (
                        <img key={i} src={src} alt="" className="w-20 h-20 object-cover rounded-lg border-2 border-daidong-red" />
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-white transition-colors">Hủy bỏ</button>
              <button type="submit" form="productForm" disabled={saving} className="px-6 py-2.5 bg-daidong-black text-white font-bold rounded-lg hover:bg-daidong-red transition-colors shadow-md flex items-center gap-2 disabled:opacity-60">
                {saving && <FaSpinner className="animate-spin" />}
                {isEditing ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Quản lý Danh mục */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Quản lý Danh mục</h2>
              <button onClick={() => { 
                setIsCatModalOpen(false); 
                setEditingCat(null); 
                setNewCategoryName(''); 
                setCategoryImageFile(null);
                setCategoryImagePreview(null);
              }} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"><FaTimes /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4 mb-6">
                <div className="flex gap-2">
                  <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nhập tên danh mục..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-daidong-black outline-none" onKeyDown={(e) => e.key === 'Enter' && handleSaveCategory()} />
                  <button onClick={handleSaveCategory} disabled={catSaving} className="px-4 py-2 bg-daidong-black text-white rounded-lg hover:bg-daidong-red transition-colors font-medium whitespace-nowrap flex items-center gap-1 disabled:opacity-60">
                    {catSaving && <FaSpinner className="animate-spin" size={12} />}
                    {editingCat ? 'Cập nhật' : 'Thêm'}
                  </button>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden flex items-center justify-center group">
                    {categoryImagePreview ? (
                      <>
                        <img src={categoryImagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => { setCategoryImageFile(null); setCategoryImagePreview(null); }}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTimes size={10} />
                        </button>
                      </>
                    ) : (
                      <FaImage className="text-gray-300 text-2xl" />
                    )}
                  </div>
                  <div>
                    <input type="file" onChange={handleCategoryImageChange} accept="image/*" className="hidden" id="categoryImageInput" />
                    <button 
                      type="button"
                      onClick={() => document.getElementById('categoryImageInput').click()} 
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <FaUpload size={12} /> {categoryImagePreview ? 'Thay đổi ảnh' : 'Chọn ảnh đại diện'}
                    </button>
                    <p className="text-[10px] text-gray-400 mt-1">Dung lượng tối đa 5MB. Định dạng: JPG, PNG, WEBP</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                {categories.length === 0 ? (
                  <div className="p-4 text-center text-gray-400 text-sm">Chưa có danh mục nào</div>
                ) : categories.map(cat => (
                  <div key={cat._id} className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                    <div>
                      <span className="font-medium text-gray-900">{cat.name}</span>
                      <span className="text-xs text-gray-400 ml-2">({cat.slug})</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEditCategory(cat)} className="p-2 text-gray-400 hover:text-daidong-black hover:bg-gray-100 rounded transition-colors"><FaEdit size={14} /></button>
                      <button onClick={() => handleDeleteCategory(cat._id)} className="p-2 text-gray-400 hover:text-daidong-red hover:bg-red-50 rounded transition-colors"><FaTrash size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
              <button onClick={() => { 
                setIsCatModalOpen(false); 
                setEditingCat(null); 
                setNewCategoryName(''); 
                setCategoryImageFile(null);
                setCategoryImagePreview(null);
              }} className="px-6 py-2.5 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors">Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modals */}
      <ConfirmModal 
        isOpen={isDeleteProductModalOpen}
        onClose={() => setIsDeleteProductModalOpen(false)}
        onConfirm={handleDeleteProductConfirm}
        title="Xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác."
        confirmText="Xóa sản phẩm"
        type="danger"
      />

      <ConfirmModal 
        isOpen={isDeleteCategoryModalOpen}
        onClose={() => setIsDeleteCategoryModalOpen(false)}
        onConfirm={handleDeleteCategoryConfirm}
        title="Xóa danh mục"
        message="Bạn có chắc chắn muốn xóa danh mục này không? Các sản phẩm thuộc danh mục này có thể bị ảnh hưởng."
        confirmText="Xóa danh mục"
        type="danger"
      />
    </div>
  );
};

export default Products;
