import Product from "../models/product.model.js";

// GET /api/products
export const getAllProducts = async (req, res) => {
    try {
        const { search, category, status, page = 1, limit = 20 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } }
            ];
        }
        if (category) query.category = category;
        if (status) query.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({ products, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name slug');
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// POST /api/products
export const createProduct = async (req, res) => {
    try {
        const { name, sku, description, price, originalPrice, stock, category, status, sale, variants: variantsRaw } = req.body;

        if (!name || !sku || !price || !category) {
            return res.status(400).json({ message: "Thiếu các trường bắt buộc: tên, SKU, giá, danh mục" });
        }

        const existingSku = await Product.findOne({ sku: sku.toUpperCase() });
        if (existingSku) return res.status(400).json({ message: "Mã SKU đã tồn tại" });

        // Parse variants from JSON string (sent via FormData)
        let variants = [];
        if (variantsRaw) {
            try { variants = JSON.parse(variantsRaw); } catch { variants = []; }
        }

        // Handle uploaded image(s)
        const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

        const product = new Product({
            name, sku, description, price, originalPrice, stock,
            category, status, sale,
            images, variants
        });
        await product.save();
        const populated = await product.populate('category', 'name slug');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

        const { name, sku, description, price, originalPrice, stock, category, status, sale, keepImages, variants: variantsRaw } = req.body;

        if (name) product.name = name;
        if (sku) product.sku = sku;
        if (description !== undefined) product.description = description;
        if (price) product.price = price;
        if (originalPrice !== undefined) product.originalPrice = originalPrice;
        if (stock !== undefined) product.stock = stock;
        if (category) product.category = category;
        if (status) product.status = status;
        if (sale !== undefined) product.sale = sale;

        // Parse variants
        if (variantsRaw !== undefined) {
            try { product.variants = JSON.parse(variantsRaw); } catch { product.variants = []; }
        }

        // Handle new images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(f => `/uploads/${f.filename}`);
            const existing = keepImages === 'true' ? product.images : [];
            product.images = [...existing, ...newImages];
        }

        await product.save();
        const populated = await product.populate('category', 'name slug');
        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        await product.deleteOne();
        res.json({ message: "Đã xóa sản phẩm thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
