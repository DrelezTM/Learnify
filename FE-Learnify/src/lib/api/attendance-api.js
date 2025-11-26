import { baseAxios } from "../baseAxios";

export async function fetchTodaySessions() {
    try {
        const { data } = await baseAxios.get(`/attendance/today`);
        return data;
    } catch (error) {
        console.error('Failed to fetch sessions:', error);
        throw error;
    }
}

export async function submitAttendance(sessionId) {
    try {
        const { data } = await baseAxios.post(`/attendance`, { session_id: sessionId });
        return data;
    } catch (error) {
        console.error('Failed to submit attendance:', error);
        throw error;
    }
}