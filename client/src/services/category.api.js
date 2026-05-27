import api from "./api";

export const categoryApi = {
    getAll: () => api.get("/categories"),
    create: (data) => api.post("/categories", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }),
    update: (id, data) => api.put(`/categories/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }),
    delete: (id) => api.delete(`/categories/${id}`),
};
