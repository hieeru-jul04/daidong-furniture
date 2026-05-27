import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { FaMoneyBillWave, FaShoppingCart, FaUsers, FaBoxOpen, FaArrowUp, FaArrowDown, FaSpinner } from 'react-icons/fa';
import { dashboardApi } from '../../../services/dashboard.api';
import { Link } from 'react-router-dom';

const COLORS = ['#d72027', '#1a1a1a', '#8c8273', '#e5e7eb', '#4b5563', '#9ca3af'];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, subtitle, loading }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
    {loading && (
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
         <FaSpinner className="animate-spin text-gray-400 text-2xl" />
      </div>
    )}
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-700">
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-auto pt-4 flex items-center text-sm border-t border-gray-50">
      {trend === 'up' ? (
        <span className="text-green-500 flex items-center font-medium">
          <FaArrowUp className="mr-1" size={12} /> {trendValue}
        </span>
      ) : trend === 'down' ? (
        <span className="text-red-500 flex items-center font-medium">
          <FaArrowDown className="mr-1" size={12} /> {trendValue}
        </span>
      ) : (
        <span className="text-gray-500 flex items-center font-medium">
          -
        </span>
      )}
      <span className="text-gray-400 ml-2">{subtitle}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProductsSold: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.getStats();
      const data = res.data;
      setStats(data.stats);
      setRevenueData(data.revenueData);
      setCategoryData(data.categoryData);
      setRecentOrders(data.recentOrders);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered': return <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">Hoàn thành</span>;
      case 'Cancelled': return <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-medium">Đã hủy</span>;
      case 'Pending': return <span className="bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-medium">Chờ xử lý</span>;
      case 'Processing': return <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">Đang xử lý</span>;
      case 'Shipped': return <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-medium">Đang giao</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h1>
          <p className="text-gray-500 text-sm mt-1">Dữ liệu thống kê thời gian thực của cửa hàng.</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="bg-white cursor-pointer border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-daidong-black shadow-sm hover:bg-gray-50 font-medium flex items-center gap-2"
        >
          {loading ? <FaSpinner className="animate-spin" /> : null}
          Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng doanh thu" 
          value={`$${stats.totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2})}`} 
          icon={FaMoneyBillWave} 
          trend="" 
          trendValue="" 
          subtitle="Tất cả thời gian"
          loading={loading}
        />
        <StatCard 
          title="Tổng đơn hàng" 
          value={stats.totalOrders.toLocaleString()} 
          icon={FaShoppingCart} 
          trend="" 
          trendValue="" 
          subtitle="Tất cả thời gian"
          loading={loading}
        />
        <StatCard 
          title="Tổng khách hàng" 
          value={stats.totalUsers.toLocaleString()} 
          icon={FaUsers} 
          trend="" 
          trendValue="" 
          subtitle="Tất cả thời gian"
          loading={loading}
        />
        <StatCard 
          title="Sản phẩm đã bán" 
          value={stats.totalProductsSold.toLocaleString()} 
          icon={FaBoxOpen} 
          trend="" 
          trendValue="" 
          subtitle="Tất cả thời gian"
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-2xl">
              <FaSpinner className="animate-spin text-gray-400 text-3xl" />
            </div>
          )}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Doanh thu & Lợi nhuận (Năm nay)</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d72027" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#d72027" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                  formatter={(value) => [`$${value.toFixed(2)}`, undefined]}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#1a1a1a" fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="profit" name="Lợi nhuận" stroke="#d72027" fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-1 flex flex-col relative">
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-2xl">
              <FaSpinner className="animate-spin text-gray-400 text-3xl" />
            </div>
          )}
          <h3 className="text-lg font-bold text-gray-900 mb-6">Mặt hàng theo Danh mục</h3>
          <div className="h-64 w-full flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [value, 'Sản phẩm']}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-900">{categoryData.reduce((acc, curr) => acc + curr.value, 0)}</span>
              <span className="text-xs text-gray-500">Sản phẩm</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-3">
            {categoryData.map((item, idx) => (
              <div key={idx} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <div className="text-xs text-gray-600 truncate" title={item.name}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-2xl">
            <FaSpinner className="animate-spin text-gray-400 text-3xl" />
          </div>
        )}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Đơn hàng mới nhất</h3>
          <Link to="/admin/orders" className="text-daidong-red text-sm font-medium hover:underline">Xem tất cả</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-gray-100">
                <th className="pb-3 font-medium">Mã Đơn Hàng</th>
                <th className="pb-3 font-medium">Khách hàng</th>
                <th className="pb-3 font-medium">Ngày đặt</th>
                <th className="pb-3 font-medium">Số tiền</th>
                <th className="pb-3 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-500">Chưa có đơn hàng nào.</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-mono text-xs text-gray-900">#{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                    <td className="py-4 font-bold text-gray-800">{order.shippingInfo?.fullName || 'Khách hàng'}</td>
                    <td className="py-4 text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="py-4 font-bold text-daidong-red">${order.totalPrice.toFixed(2)}</td>
                    <td className="py-4">
                      {getStatusBadge(order.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;