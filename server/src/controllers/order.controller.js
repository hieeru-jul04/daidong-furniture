import Order from "../models/order.model.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Public or Private (depending on implementation, here public)
export const createOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingInfo,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            user // Optional user ID from frontend if logged in
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: "Không có sản phẩm nào trong đơn hàng" });
        } else {
            const order = new Order({
                orderItems,
                user: user || null,
                shippingInfo,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
            });

            const createdOrder = await order.save();

            // Here you might want to also subtract stock from Product variants, but keeping it simple for now.

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
    try {
        const pageSize = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const status = req.query.status;
        const search = req.query.search;

        const query = {};

        if (status) {
            query.status = status;
        }

        if (search) {
            query['$or'] = [
                { _id: search.length === 24 ? search : null }, // simple check for valid ObjectId
                { 'shippingInfo.fullName': { $regex: search, $options: 'i' } },
                { 'shippingInfo.phone': { $regex: search, $options: 'i' } }
            ];
        }

        // Clean up invalid object id search to prevent cast error
        if (query['$or'] && query['$or'][0]._id === null) {
            query['$or'].shift();
        }

        const count = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .populate('user', 'customerCode name')
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({
            orders,
            page,
            totalPages: Math.ceil(count / pageSize),
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;
            
            if (req.body.status === 'Delivered') {
                order.isPaid = true;
                order.paidAt = Date.now();
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// @desc    Cancel order by user
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        if (order.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "Không có quyền hủy đơn hàng này" });
        }

        if (order.status !== 'Pending') {
            return res.status(400).json({ message: "Chỉ có thể hủy đơn hàng ở trạng thái Chờ xử lý" });
        }

        order.status = 'Cancelled';
        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.json({ message: "Đã xóa đơn hàng thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

