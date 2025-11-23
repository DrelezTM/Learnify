import { baseAxios } from "./baseAxios";


export async function fetchCourses() {
  try {
    const { data } = await baseAxios.get(`/courses`, { email, password });
    return data;
  } catch (error) {
    console.error('Failed to login:', error);
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
  fetchCourses, fetchLogin
};
