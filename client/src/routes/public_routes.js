import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/public/Home";
import Shop from "../pages/public/Shop";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import UserLayout from "../layouts/UserLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProductDetail from "../pages/public/ProductDetail";
import Checkout from "../pages/public/Checkout";
import Cart from "../pages/public/Cart";
import AccessDenied from "../pages/error/AccessDenied";

const public_routes = [
    {
        path: "/",
        element: Home,
        layout: UserLayout
    },
    {
        path: "/cart",
        element: Cart,
        layout: UserLayout
    },
    {
        path: "/checkout",
        element: Checkout,
        layout: UserLayout
    },
    {
        path: "/login",
        element: Login,
        layout: AuthLayout
    },
    {
        path: "/register",
        element: Register,
        layout: AuthLayout
    },
    {
        path: "/shop",
        element: Shop,
        layout: UserLayout
    },
    {
        path: "/about",
        element: About,
        layout: UserLayout
    },
    {
        path: "/contact",
        element: Contact,
        layout: UserLayout
    },
    {
        path: "/product/:id",
        element: ProductDetail,
        layout: UserLayout
    },
    {
        path: "/access-denied",
        element: AccessDenied,
        layout: AuthLayout
    }
];

export default public_routes;