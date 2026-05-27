import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../services/auth.api';
import Logo from '../../components/shared/Logo';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async ({ username, password }) => {
    try {
      const response = await authApi.login({ username, password });
      localStorage.setItem("token", response.data.token);
      if (response.data.user.role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    handleLogin({ username, password });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-daidong-light-gray">
      {/* Left Pane - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-daidong-black text-daidong-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Interior Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-daidong-black to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <Logo className="text-daidong-white" textClassName="text-4xl" />
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Chào mừng trở lại.</h1>
          <p className="text-daidong-gray text-lg leading-relaxed">
            Đăng nhập để tiếp tục trải nghiệm mua sắm nội thất cao cấp và theo dõi các đơn hàng của bạn tại Nội thất Đại Đồng.
          </p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 bg-daidong-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-10">
        <div className="md:hidden mb-12 text-center">
          <Logo className="text-daidong-black" textClassName="text-4xl" />
        </div>

        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-daidong-black mb-2">Đăng nhập</h2>
          <p className="text-daidong-gray mb-8">Vui lòng nhập thông tin để truy cập tài khoản</p>

          {error && (
            <div className="bg-red-50 text-daidong-red px-4 py-3 rounded-lg text-sm font-medium mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                placeholder="Nhập tên đăng nhập của bạn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-bold text-daidong-dark-gray">
                  Mật khẩu
                </label>
                <Link to="/forgot-password" className="text-sm text-daidong-gray hover:text-daidong-black transition-colors font-medium">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-daidong-border bg-daidong-light-gray focus:bg-white focus:outline-none focus:ring-2 focus:ring-daidong-black focus:border-transparent transition-all pr-12"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button
              type="submit"
              className="w-full cursor-pointer py-3.5 px-4 rounded-lg text-white bg-daidong-black hover:bg-daidong-red font-bold uppercase tracking-wider transition-colors duration-300 shadow-md"
            >
              Đăng nhập
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-daidong-gray">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-bold text-daidong-black hover:text-daidong-red transition-colors">
              Đăng ký ngay
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

export default Login;
