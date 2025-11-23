import axios from "axios";
import { getCookie } from "./utils";

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const baseAxios = axios.create({
    // baseURL: `${process.env.API_BASE}/api/login`,
    baseURL: `${API_BASE}/api`,
    timeout: 90000, // 90 seconds
});

baseAxios.interceptors.request.use(config => {
    const token = getCookie("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
