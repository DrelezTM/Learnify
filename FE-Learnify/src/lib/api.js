import { baseAxios } from "./baseAxios";


export async function fetchCourses() {
  try {
    const { data } = await baseAxios.get(`/courses`);
    return data;
  } catch (error) {
    console.error('Failed fetch courses:', error);
    throw error;
  }
}

export async function fetchDetailCourse(id) {
  try {
    const { data } = await baseAxios.get(`/courses/${id}`);
    return data;
  } catch (error) {
    console.error(`Failed fetch course ${id}:`, error);
    throw error;
  }
}

export async function attendSession(session_id, user_id) {
  try {
    const { data } = await baseAxios.post(`/attendance/hadir`, {
      session_id: session_id,
      user_id: user_id
    });
    return data;
  } catch (error) {
    console.error("Failed to attend session:", error);
    throw error;
  }
}



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

// export async function fetchLogin(email, password) {
//   axios({
//     url: `${API_BASE}/api/login`,
//     method: 'POST',
//     headers: { 'Accept': 'application/json' },
//     data: { email: email, password: password }
//   }).then((response) => {
//     return response.data.data;
//   }).catch((err) => {
//     throw new Error(`API error: ${err}`);
//   })
// }

export default {
  fetchCourses, fetchLogin, attendSession,
};
