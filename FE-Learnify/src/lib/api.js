const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchCourses() {
  const res = await fetch(`${API_BASE}/api/courses`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export default {
  fetchCourses,
};
