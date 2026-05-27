import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        // 1. Basic Counts
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' });
        
        // Sum total price of all 'Delivered' orders
        const revenueResult = await Order.aggregate([
            { $match: { status: 'Delivered' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        // Sum total products sold (from orderItems) or just total product types. 
        // Let's do total products sold from delivered orders
        const productsSoldResult = await Order.aggregate([
            { $match: { status: 'Delivered' } },
            { $unwind: '$orderItems' },
            { $group: { _id: null, totalProductsSold: { $sum: '$orderItems.quantity' } } }
        ]);
        const totalProductsSold = productsSoldResult.length > 0 ? productsSoldResult[0].totalProductsSold : 0;

        // 2. Revenue over time (Monthly for current year)
        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(`${currentYear}-01-01`);
        const endOfYear = new Date(`${currentYear}-12-31T23:59:59`);

        const monthlyRevenue = await Order.aggregate([
            { 
                $match: { 
                    status: 'Delivered',
                    createdAt: { $gte: startOfYear, $lte: endOfYear }
                } 
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$totalPrice" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Format monthly revenue for Recharts
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueData = months.map((month, index) => {
            const found = monthlyRevenue.find(m => m._id === index + 1);
            return {
                name: month,
                revenue: found ? found.revenue : 0,
                profit: found ? found.revenue * 0.3 : 0 // Assuming 30% profit margin as a mock for now since DB doesn't store cost
            };
        });

        // 3. Sales by Category
        // We will join Product to Category, then count products per category, or just count products in DB
        // Let's count active products per category
        const categoryStats = await Product.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryInfo"
                }
            },
            { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    name: { $ifNull: ["$categoryInfo.name", "Unknown"] },
                    value: "$count"
                }
            }
        ]);

        // 4. Recent 5 Orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('_id shippingInfo createdAt totalPrice status');

        res.json({
            stats: {
                totalRevenue,
                totalOrders,
                totalUsers,
                totalProductsSold
            },
            revenueData,
            categoryData: categoryStats.length > 0 ? categoryStats : [{ name: 'Chưa có', value: 1 }],
            recentOrders
        });

    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu thống kê", error: error.message });
    }
};
