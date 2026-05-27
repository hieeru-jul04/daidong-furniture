import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaArrowLeft, FaHome } from 'react-icons/fa';

const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-daidong-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-daidong-red/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-daidong-black/5 rounded-full blur-3xl"></div>

            <div className="max-w-2xl w-full bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl p-8 md:p-16 shadow-2xl text-center relative z-10">
                {/* Lock Icon Animation */}
                <div className="flex justify-center mb-8 relative">
                    <div className="w-24 h-24 bg-red-50 rounded-2xl flex items-center justify-center transform rotate-12 animate-pulse">
                        <FaLock className="text-4xl text-daidong-red" />
                    </div>
                    <div className="absolute inset-0 bg-red-400 opacity-20 blur-2xl rounded-full"></div>
                </div>

                <h1 className="text-8xl md:text-9xl font-bold text-daidong-black mb-4 tracking-tighter">403</h1>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Truy Cập Bị Từ Chối</h2>
                
                <p className="text-gray-500 mb-10 text-lg leading-relaxed max-w-lg mx-auto">
                    Xin lỗi, bạn không có quyền truy cập vào trang này. Khu vực này được giới hạn cho các tài khoản có phân quyền tương ứng.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto px-8 py-3.5 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                        <FaArrowLeft className="text-gray-400 group-hover:-translate-x-1 transition-transform" />
                        Quay lại
                    </button>
                    
                    <Link 
                        to="/"
                        className="w-full sm:w-auto px-8 py-3.5 bg-daidong-black text-white font-bold rounded-xl hover:bg-daidong-red transition-colors duration-300 shadow-lg shadow-black/10 flex items-center justify-center gap-2"
                    >
                        <FaHome />
                        Về trang chủ
                    </Link>
                </div>
            </div>

            {/* Footer or Support Text */}
            <p className="mt-12 text-sm text-gray-400">
                Bạn cho rằng đây là lỗi? Vui lòng liên hệ <a href="mailto:support@daidong.com" className="text-daidong-red hover:underline font-medium">hỗ trợ</a>.
            </p>
        </div>
    );
};

export default AccessDenied;
