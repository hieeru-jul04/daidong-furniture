import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaTimes, FaKey, FaChevronRight, FaSpinner, FaBoxOpen } from 'react-icons/fa';
import { authApi } from '../../services/auth.api';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [username, setUsername] = useState('');

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authApi.getProfile();
        const user = res.data.user;
        setUsername(user.username);
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || ''
        });
      } catch (error) {
        console.error("Lỗi khi tải thông tin cá nhân:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await authApi.updateProfile(formData);
      // Update local storage token if returned
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      setIsEditing(false);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật!');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu mới và xác nhận không khớp!');
      return;
    }
    setPasswordSubmitting(true);
    try {
      await authApi.changePassword({ oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword });
      alert('Đổi mật khẩu thành công!');
      setIsPasswordModalOpen(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu!');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return (
    <div className="bg-daidong-light-gray min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-daidong-black pt-32 pb-12 rounded-b-[3rem] mb-12 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center text-sm text-daidong-gray mb-4">
            <Link to="/" className="hover:text-daidong-white transition-colors">Trang chủ</Link>
            <FaChevronRight className="mx-2 text-[10px]" />
            <span className="text-daidong-white font-bold">Hồ sơ cá nhân</span>
          </div>
          <h1 className="text-4xl font-bold text-daidong-white">Hồ sơ cá nhân</h1>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-daidong-white rounded-[2rem] p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-daidong-border">
                <div className="w-16 h-16 rounded-full bg-daidong-light-gray flex items-center justify-center text-daidong-gray text-2xl font-bold uppercase">
                  {formData.name ? formData.name.charAt(0) : (username ? username.charAt(0) : 'U')}
                </div>
                <div>
                  <h3 className="font-bold text-daidong-black">{formData.name || username || 'Người dùng'}</h3>
                  <p className="text-sm text-daidong-gray">Thành viên DAIDONG</p>
                </div>
              </div>

              <div className="space-y-2">
                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-daidong-black text-daidong-white font-bold transition-colors">
                  <FaUser /> Thông tin cá nhân
                </Link>
                <Link to="/order-history" className="flex items-center gap-3 px-4 py-3 rounded-xl text-daidong-gray hover:bg-daidong-light-gray hover:text-daidong-black font-bold transition-colors">
                  <FaBoxOpen /> Lịch sử đơn hàng
                </Link>
                <button 
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-daidong-gray hover:bg-daidong-light-gray hover:text-daidong-black font-bold transition-colors">
                  <FaKey /> Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <div className="bg-daidong-white rounded-[2rem] p-8 md:p-12 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-daidong-black">Thông tin tài khoản</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-daidong-red cursor-pointer hover:text-daidong-black font-bold flex items-center gap-2 transition-colors"
                  disabled={loading || submitting}
                >
                  {isEditing ? <><FaTimes /> Hủy</> : <><FaEdit /> Chỉnh sửa</>}
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <FaSpinner className="animate-spin text-4xl text-daidong-gray" />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-daidong-dark-gray flex items-center gap-2">
                        <FaUser className="text-daidong-gray" /> Họ và tên
                      </label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={submitting}
                          placeholder="Nhập họ và tên"
                          className="w-full px-4 py-3 rounded-xl border border-daidong-border bg-daidong-light-gray focus:bg-white focus:ring-2 focus:ring-daidong-black transition-all font-medium text-daidong-black"
                        />
                      ) : (
                        <div className="py-3 font-medium text-daidong-black border border-transparent">
                          {formData.name || <span className="text-gray-400 italic">Chưa cập nhật</span>}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-daidong-dark-gray flex items-center gap-2">
                        <FaEnvelope className="text-daidong-gray" /> Email
                      </label>
                      {isEditing ? (
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={submitting}
                          placeholder="Nhập địa chỉ email"
                          className="w-full px-4 py-3 rounded-xl border border-daidong-border bg-daidong-light-gray focus:bg-white focus:ring-2 focus:ring-daidong-black transition-all font-medium text-daidong-black"
                        />
                      ) : (
                        <div className="py-3 font-medium text-daidong-black border border-transparent">
                          {formData.email || <span className="text-gray-400 italic">Chưa cập nhật</span>}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-daidong-dark-gray flex items-center gap-2">
                        <FaPhone className="text-daidong-gray" /> Số điện thoại
                      </label>
                      {isEditing ? (
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={submitting}
                          placeholder="Nhập số điện thoại"
                          className="w-full px-4 py-3 rounded-xl border border-daidong-border bg-daidong-light-gray focus:bg-white focus:ring-2 focus:ring-daidong-black transition-all font-medium text-daidong-black"
                        />
                      ) : (
                        <div className="py-3 font-medium text-daidong-black border border-transparent">
                          {formData.phone || <span className="text-gray-400 italic">Chưa cập nhật</span>}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-daidong-dark-gray flex items-center gap-2">
                        <FaMapMarkerAlt className="text-daidong-gray" /> Địa chỉ
                      </label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={submitting}
                          placeholder="Nhập địa chỉ giao hàng"
                          className="w-full px-4 py-3 rounded-xl border border-daidong-border bg-daidong-light-gray focus:bg-white focus:ring-2 focus:ring-daidong-black transition-all font-medium text-daidong-black"
                        />
                      ) : (
                        <div className="py-3 font-medium text-daidong-black border border-transparent">
                          {formData.address || <span className="text-gray-400 italic">Chưa cập nhật</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-6 border-t border-daidong-border flex justify-end">
                      <button 
                        type="submit" 
                        disabled={submitting}
                        className="bg-daidong-black text-daidong-white px-8 py-3 flex items-center gap-2 rounded-full font-bold uppercase tracking-wider hover:bg-daidong-red transition-colors shadow-lg disabled:opacity-50"
                      >
                        {submitting && <FaSpinner className="animate-spin" />}
                        Lưu thay đổi
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Đổi mật khẩu</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-900"><FaTimes size={20} /></button>
            </div>
            <div className="p-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu hiện tại</label>
                  <input type="password" required value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-daidong-black outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu mới</label>
                  <input type="password" required value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-daidong-black outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                  <input type="password" required value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-daidong-black outline-none" />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold">Hủy</button>
                  <button type="submit" disabled={passwordSubmitting} className="px-4 py-2 bg-daidong-black text-white rounded-lg hover:bg-daidong-red font-bold flex items-center gap-2">
                    {passwordSubmitting && <FaSpinner className="animate-spin" />} Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;