import admin_routes from "./admin_routes";
import user_routes from "./user_routes";
import public_routes from "./public_routes";

const routes = [
    ...admin_routes,
    ...user_routes,
    ...public_routes
];

export default routes;