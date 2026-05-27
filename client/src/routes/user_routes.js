import Profile from "../pages/user/Profile";
import OrderHistory from "../pages/user/OrderHistory";
import UserLayout from "../layouts/UserLayout";

const user_routes = [
    {
        path: `/profile`,
        element: Profile,
        layout: UserLayout,
        role: "user"
    },
    {
        path: `/order-history`,
        element: OrderHistory,
        layout: UserLayout,
        role: "user"
    }
];

export default user_routes;