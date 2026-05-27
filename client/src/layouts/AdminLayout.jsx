import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FaTachometerAlt,
    FaUsers,
    FaShoppingCart,
    FaBox,
    FaCog,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaClipboardList,
    FaUserTie
} from 'react-icons/fa';
import { authApi } from '../services/auth.api';
import Logo from '../components/shared/Logo';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        fetch((import.meta.env.VITE_API_URL || "http://localhost:8080") + "/api/auth/admin", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {

                if (!res.ok) throw new Error("Forbidden");
                return res.json();
            })
            .then(data => console.log(data))
            .catch((err) => {
                window.location.href = "/login"; // 🔥 bị chặn → đá ra
            });
    }, []);

    const menuItems = [
        {
            path: '/admin/dashboard',
            icon: FaTachometerAlt,
            label: 'Bảng điều khiển',
            description: 'Tổng quan và thống kê'
        },
        {
            path: '/admin/users',
            icon: FaUsers,
            label: 'Khách hàng',
            description: 'Quản lý tài khoản khách hàng'
        },
        {
            path: '/admin/products',
            icon: FaBox,
            label: 'Sản phẩm',
            description: 'Quản lý danh sách sản phẩm'
        },
        {
            path: '/admin/orders',
            icon: FaShoppingCart,
            label: 'Đơn hàng',
            description: 'Quản lý đơn hàng'
        },
        {
            path: '/admin/settings',
            icon: FaCog,
            label: 'Cài đặt',
            description: 'Cài đặt hệ thống'
        }
    ];

    const handleLogout = async () => {
        try {
            await authApi.logout();
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const isActivePath = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Sidebar */}
            <aside className={`bg-gray-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'
                }`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-800">
                        <div className={`flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} h-10`}>
                            {isSidebarOpen ? (
                                <Logo className="text-white" textClassName="text-2xl" />
                            ) : (
                                <div className="w-10 h-10 bg-daidong-red rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">W</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4">
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActivePath(item.path)
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            }`}
                                        title={!isSidebarOpen ? item.label : ''}
                                    >
                                        <item.icon size={20} />
                                        {isSidebarOpen && (
                                            <div>
                                                <div className="font-medium">{item.label}</div>
                                                <div className="text-xs text-gray-400">{item.description}</div>
                                            </div>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-gray-800">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                <FaCog size={16} />
                            </div>
                            {isSidebarOpen && (
                                <div className="flex-1">
                                    <div className="font-medium">Quản trị viên</div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        <FaSignOutAlt size={14} />
                                        <span>Đăng xuất</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                        </button>

                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                Xin chào, <span className="font-medium text-gray-900">Quản trị viên</span>
                            </div>
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;