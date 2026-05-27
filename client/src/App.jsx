import './App.css'
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import routes from './routes/index'
import ProtectedRoute from './routes/ProtectedRoute'

const AdminRedirector = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decodedToken = JSON.parse(jsonPayload);
      const userRole = decodedToken.role;

      if (userRole === 'admin' && !location.pathname.startsWith('/admin')) {
        return <Navigate to="/admin/dashboard" replace />;
      }
    } catch (error) {
      // Ignore token parse errors
    }
  }
  return children;
};

function App() {
  return (
    <AdminRedirector>
      <Routes>
        {routes.map((route) => {
          const Element = (
            <route.layout>
              <route.element />
            </route.layout>
          );

          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.role ? (
                  <ProtectedRoute requiredRole={route.role}>
                    {Element}
                  </ProtectedRoute>
                ) : (
                  Element
                )
              }
            />
          );
        })}
      </Routes>
    </AdminRedirector>
  );
}

export default App
