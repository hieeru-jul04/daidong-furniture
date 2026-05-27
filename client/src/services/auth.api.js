import api from "./api";

export const authApi = {
    login: (data) => api.post("/auth/login", data),
    register: (data) => api.post("/auth/register", data),
    logout: () => api.post("/auth/logout"),
    getProfile: () => api.get("/auth/profile"),
    updateProfile: (userData) => api.put("/auth/profile", userData),
    changePassword: (data) => api.put("/auth/change-password", data),
};