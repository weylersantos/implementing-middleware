import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // ESSENCIAL: Permite que o browser envie o cookie automaticamente
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      window.location.href = "/login";
    }
  },
);
