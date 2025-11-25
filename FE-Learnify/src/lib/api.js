import { baseAxios } from "./baseAxios";


// Lecturer
export async function fetchCourses() {
  try {
    const { data } = await baseAxios.get(`/courses`);
    return data;
  } catch (error) {
    console.error('Failed fetch courses:', error);
    throw error;
  }
}

export async function createCourse(title, description, major, studyProgram, className, batch) {
  try {
    const { data } = await baseAxios.post(`/courses`, { title, description, major, study_program: studyProgram, class: className, batch });
    return data;
  } catch (error) {
    console.error('Failed create course:', error);
    throw error;
  }
}

export async function addWeek(courseId, title) {
  try {
    const { data } = await baseAxios.post(`/courses/${courseId}/weeks`, { title });
    return data;
  } catch (error) {
    console.error('Failed add week:', error);
    throw error;
  }
}

export async function editWeek(courseId, title, weekId) {
  try {
    const { data } = await baseAxios.put(`/courses/${courseId}/weeks/${weekId}`, { title });
    return data;
  } catch (error) {
    console.error('Failed edit week:', error);
    throw error;
  }
}

export async function deleteWeek(courseId, weekId) {
  try {
    const { data } = await baseAxios.delete(`/courses/${courseId}/weeks/${weekId}`);
    return data;
  } catch (error) {
    console.error('Failed delete week:', error);
    throw error;
  }
}

export async function addMaterials(courseId, weekId, formData) {
  try {
    const { data } = await baseAxios.post(
      `/courses/${courseId}/weeks/${weekId}/materials`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  } catch (error) {
    console.error("Failed add material:", error);
    throw error;
  }
}

export async function addAssignments(courseId, weekId, formData) {
  try {
    const { data } = await baseAxios.post(
      `/courses/${courseId}/weeks/${weekId}/assignments`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  } catch (error) {
    console.error("Failed add assignment:", error);
    throw error;
  }
}

export async function showMaterial(courseId, weekId, materialId) {
  try {
    const { data } = await baseAxios.get(
      `/courses/${courseId}/weeks/${weekId}/materials/${materialId}`,
    );
    return data;
  } catch (error) {
    console.error("Failed show material:", error);
    throw error;
  }
}

export async function showAssignment(courseId, weekId, assignmentId) {
  try {
    const { data } = await baseAxios.get(
      `/courses/${courseId}/weeks/${weekId}/assignments/${assignmentId}`,
    );
    return data;
  } catch (error) {
    console.error("Failed show assignment:", error);
    throw error;
  }
}


// Student
export async function joinCourse(enrollment_key) {
  try {
    const { data } = await baseAxios.post(`/courses/join`, { enrollment_key });
    return data;
  } catch (error) {
    console.error('Failed join course:', error);
    throw error;
  }
}

export async function fetchCoursesStudent() {
  try {
    const { data } = await baseAxios.get(`/courses/me`);
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