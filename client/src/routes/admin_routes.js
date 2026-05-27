import Dashboard from "../pages/admin/dashboard/Dashboard";
import Products from "../pages/admin/products/Products";
import Orders from "../pages/admin/orders/Orders";
import Users from "../pages/admin/users/Users";
import Settings from "../pages/admin/settings/Settings";
import AdminLayout from "../layouts/AdminLayout";

const prefix = "/admin";

const admin_routes = [
    {
        path: `${prefix}/dashboard`,
        element: Dashboard,
        layout: AdminLayout,
        role: "admin"
    },
    {
        path: `${prefix}/products`,
        element: Products,
        layout: AdminLayout,
        role: "admin"
    },
    {
        path: `${prefix}/orders`,
        element: Orders,
        layout: AdminLayout,
        role: "admin"
    },
    {
        path: `${prefix}/users`,
        element: Users,
        layout: AdminLayout,
        role: "admin"
    },
    {
        path: `${prefix}/settings`,
        element: Settings,
        layout: AdminLayout,
        role: "admin"
    }
];

export default admin_routes;