import Category from "../models/category.model.js";

// GET /api/categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// POST /api/categories
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ message: "Tên danh mục là bắt buộc" });

        const slug = name.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove diacritics
            .replace(/đ/g, "d").replace(/Đ/g, "d")
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');

        const existing = await Category.findOne({ $or: [{ name }, { slug }] });
        if (existing) return res.status(400).json({ message: "Danh mục đã tồn tại" });

        const image = req.file ? `/uploads/${req.file.filename}` : '';

        const category = new Category({ name, slug, description, image });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục" });

        if (name) {
            category.name = name;
            category.slug = name.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d").replace(/Đ/g, "d")
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '');
        }
        if (description !== undefined) category.description = description;

        if (req.file) {
            category.image = `/uploads/${req.file.filename}`;
        }

        await category.save();
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục" });

        // Check if category is used by any product
        const Product = (await import("../models/product.model.js")).default;
        const productsInCategory = await Product.countDocuments({ category: req.params.id });
        if (productsInCategory > 0) {
            return res.status(400).json({ message: "Không thể xóa danh mục đang có sản phẩm" });
        }

        await category.deleteOne();
        res.json({ message: "Đã xóa danh mục thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
