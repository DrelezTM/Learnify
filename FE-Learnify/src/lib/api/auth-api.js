import { baseAxios } from "../baseAxios";


export async function fetchLogin(email, password) {
    try {
        const { data } = await baseAxios.post(`/login`, { email, password });
        return data;
    } catch (error) {
        console.error('Failed to login:', error);
        throw error;
    }
}

export async function fetchLogout() {
    try {
        const { data } = await baseAxios.delete(`/logout`);
        return data;
    } catch (error) {
        console.error('Failed to logout:', error);
        throw error;
    }
}

export async function fetchMyProfile() {
    try {
        const { data } = await baseAxios.get("/me");
        return data;
    } catch (error) {
        console.error("Failed fetch my profile:", error);
        throw error;
    }
}

export async function fetchProfile(id) {
    try {
        const { data } = await baseAxios.get(`/user/show/${id}`);
        return data;
    } catch (error) {
        console.error("Failed fetch profile:", error);
        throw error;
    }
}