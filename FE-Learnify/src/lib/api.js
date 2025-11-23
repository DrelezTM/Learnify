import axios from "axios";
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchCourses() {
  const res = await fetch(`${API_BASE}/api/courses`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
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
