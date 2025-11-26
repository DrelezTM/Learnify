import { baseAxios } from "../baseAxios";

export async function getSchedules(month, year) {
    try {
        const { data } = await baseAxios.get(`/schedules?month=${month}&year=${year}`);
        return data;
    } catch (error) {
        console.error("Failed to fetch schedules:", error);
        throw error;
    }
}