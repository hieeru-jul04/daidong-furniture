import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/auth.api';
import Logo from '../../components/shared/Logo';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await authApi.register(registerData);
      setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập.');
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    handleRegister();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-daidong-light-gray">
      {/* Left Pane - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-daidong-black text-daidong-white flex-col justify-between p-12 relative overflow-hidden order-2 md:order-1">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Interior Background 2" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-daidong-black to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <Logo className="text-daidong-white" textClassName="text-4xl" />
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Khơi nguồn cảm hứng.</h1>
          <p className="text-daidong-gray text-lg leading-relaxed">
            Tạo tài khoản ngay hôm nay để nhận những ưu đãi độc quyền và quản lý không gian sống của bạn cùng Nội thất Đại Đồng.
          </p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 bg-daidong-white shadow-[10px_0_30px_rgba(0,0,0,0.05)] z-10 order-1 md:order-2">
        <div className="md:hidden mb-12 text-center">
          <Logo className="text-daidong-black" textClassName="text-4xl" />
        </div>

        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-daidong-black mb-2">Tạo tài khoản</h2>
          <p className="text-daidong-gray mb-8">Điền thông tin bên dưới để đăng ký thành viên</p>

          {error && (
            <div className="bg-red-50 text-daidong-red px-4 py-3 rounded-lg text-sm font-medium mb-6 border border-red-100">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm font-medium mb-6 border border-green-100">
              {successMessage}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-daidong-dark-gray mb-2">
                Họ và Tên
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-daidong-border bg-daidong-light-gray focus:bg-white focus:outline-none focus:ring-2 focus:ring-daidong-black focus:border-transparent transition-all"
                placeholder="Nhập họ và tên"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-bold text-daidong-dark-gray mb-2">
                Tên đăng nhập
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-daidong-border bg-daidong-light-gray focus:bg-white focus:outline-none focus:ring-2 focus:ring-daidong-black focus:border-transparent transition-all"
                placeholder="Nhập tên đăng nhập"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-daidong-dark-gray mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-daidong-border bg-daidong-light-gray focus:bg-white focus:outline-none focus:ring-2 focus:ring-daidong-black focus:border-transparent transition-all pr-12"
                  placeholder="Tạo mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute cursor-pointer inset-y-0 right-0 pr-4 flex items-center text-daidong-gray hover:text-daidong-black transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-daidong-dark-gray mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-daidong-border bg-daidong-light-gray focus:bg-white focus:outline-none focus:ring-2 focus:ring-daidong-black focus:border-transparent transition-all pr-12"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute cursor-pointer inset-y-0 right-0 pr-4 flex items-center text-daidong-gray hover:text-daidong-black transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer py-3.5 px-4 mt-2 rounded-lg text-white bg-daidong-black hover:bg-daidong-red font-bold uppercase tracking-wider transition-colors duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" /> Đang đăng ký...
                </>
              ) : (
                'Đăng ký'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-daidong-gray">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-bold text-daidong-black hover:text-daidong-red transition-colors">
              Đăng nhập ngay
            </Link>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/" className="text-sm font-medium text-daidong-gray hover:text-daidong-black transition-colors inline-flex items-center">
              &larr; Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
