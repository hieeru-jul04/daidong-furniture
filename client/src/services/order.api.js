import api from "./api";

export const orderApi = {
    createOrder: (orderData) => api.post("/orders", orderData),
    getMyOrders: () => api.get("/orders/myorders"),
    getAllOrders: (params) => api.get("/orders", { params }),
    updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
    cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
    deleteOrder: (id) => api.delete(`/orders/${id}`),
};
