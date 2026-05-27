import { useState, useEffect, useCallback } from 'react';
import { productApi } from '../services/product.api';

const BASE_URL = 'http://localhost:8080';

export const getImageSrc = (img) => {
  if (!img) return 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=500&q=80';
  return img.startsWith('http') ? img : `${BASE_URL}${img}`;
};

// Normalize a product from backend to match the shape ProductCard expects
export const normalizeProduct = (p) => ({
  id: p._id,
  _id: p._id,
  name: p.name,
  price: p.price,
  originalPrice: p.originalPrice,
  rating: p.rating || 0,
  reviews: p.reviews || 0,
  image: getImageSrc(p.images?.[0]),
  hoverImage: getImageSrc(p.images?.[1] || p.images?.[0]),
  images: p.images?.map(getImageSrc) || [],
  category: p.category?.name || '',
  categoryId: p.category?._id,
  sku: p.sku,
  description: p.description,
  stock: p.stock,
  status: p.status,
  sale: p.sale || !!p.originalPrice,
  new: p.new || false,
  variants: p.variants || [],
});

// Hook to fetch paginated product list
export const useProducts = ({ search = '', categoryId = '', page = 1, limit = 12 } = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (categoryId) params.category = categoryId;
      const res = await productApi.getAll(params);
      setProducts(res.data.products.map(normalizeProduct));
      setPagination({ total: res.data.total, totalPages: res.data.totalPages });
    } catch (err) {
      setError('Không thể tải sản phẩm');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, page, limit]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return { products, loading, pagination, error, refetch: fetchProducts };
};

// Hook to fetch a single product by id
export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    productApi.getById(id)
      .then(res => setProduct(normalizeProduct(res.data)))
      .catch(() => setError('Không tìm thấy sản phẩm'))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
};
