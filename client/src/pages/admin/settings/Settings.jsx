import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaSave, FaSpinner } from 'react-icons/fa';
import { authApi } from '../../../services/auth.api';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authApi.getProfile();
        const user = res.data.user;
        setProfileData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        });
      } catch (error) {
        console.error("Lỗi khi tải thông tin admin:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authApi.updateProfile(profileData);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật!');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }
    setSubmitting(true);
    try {
      await authApi.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      alert('Đổi mật khẩu thành công!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
        <p className="text-gray-500 text-sm mt-1">Quản lý thông tin cá nhân và bảo mật tài khoản Admin.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex overflow-hidden min-h-[500px]">
        {/* Sidebar Tabs */}
        <div className="w-64 border-r border-gray-100 bg-gray-50 p-6 hidden md:block">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'profile' ? 'bg-daidong-black text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FaUser /> Thông tin cá nhân
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'password' ? 'bg-daidong-black text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FaLock /> Bảo mật & Mật khẩu
              </button>
            </li>
          </ul>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex border-b border-gray-100 w-full overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex justify-center items-center gap-2 py-4 font-medium whitespace-nowrap ${
              activeTab === 'profile' ? 'border-b-2 border-daidong-black text-daidong-black' : 'text-gray-500'
            }`}
          >
            <FaUser /> Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 flex justify-center items-center gap-2 py-4 font-medium whitespace-nowrap ${
              activeTab === 'password' ? 'border-b-2 border-daidong-black text-daidong-black' : 'text-gray-500'
            }`}
          >
            <FaLock /> Bảo mật & Mật khẩu
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <FaSpinner className="animate-spin text-gray-400 text-3xl" />
            </div>
          ) : (
            <>
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="max-w-2xl animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h2>
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên</label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-daidong-black outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-daidong-black outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-daidong-black outline-none"
                      />
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2.5 bg-daidong-black text-white font-bold rounded-lg hover:bg-daidong-red transition-colors shadow-md flex items-center gap-2 disabled:opacity-60"
                      >
                        {submitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Lưu thông tin
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <div className="max-w-2xl animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Đổi mật khẩu</h2>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-daidong-black outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu mới</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-daidong-black outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-daidong-black outline-none"
                        required
                      />
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2.5 bg-daidong-black text-white font-bold rounded-lg hover:bg-daidong-red transition-colors shadow-md flex items-center gap-2 disabled:opacity-60"
                      >
                        {submitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Cập nhật mật khẩu
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
