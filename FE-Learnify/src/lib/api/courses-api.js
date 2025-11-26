import { baseAxios } from "../baseAxios";

// Fetching Courses
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

export async function editCourse(courseId, title, description) {
    try {
        const { data } = await baseAxios.put(`/courses/${courseId}`, { title, description });
        return data;
    } catch (error) {
        console.error('Failed edit course:', error);
        throw error;
    }
}

export async function deleteCourse(courseId) {
    try {
        const { data } = await baseAxios.delete(`/courses/${courseId}`);
        return data;
    } catch (error) {
        console.error('Failed delete course:', error);
        throw error;
    }
}

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

export async function studentLeaveCourse(id) {
    try {
        const { data } = await baseAxios.delete(`/courses/${id}/leave`);
        return data;
    } catch (error) {
        console.error('Failed to leave course:', error);
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


// Weeks
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

// Materials & Assignment
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

export async function deleteMaterial(courseId, weekId, materialId) {
    try {
        const { data } = await baseAxios.delete(`/courses/${courseId}/weeks/${weekId}/materials/${materialId}`);
        return data;
    } catch (error) {
        console.error('Failed delete material:', error);
        throw error;
    }
}

export async function deleteAssignment(courseId, weekId, assignmentId) {
    try {
        const { data } = await baseAxios.delete(`/courses/${courseId}/weeks/${weekId}/assignments/${assignmentId}`);
        return data;
    } catch (error) {
        console.error('Failed delete material:', error);
        throw error;
    }
}

export async function submitAssignment(courseId, weekId, assignmentId, formData) {
    try {
        const { data } = await baseAxios.post(
            `/courses/${courseId}/weeks/${weekId}/assignments/${assignmentId}/submissions`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return data;
    } catch (error) {
        console.error("Failed submit assignment:", error);
        throw error;
    }
}

export async function deleteSubmission(courseId, weekId, assignmentId, submissionId) {
    try {
        const { data } = await baseAxios.delete(
            `/courses/${courseId}/weeks/${weekId}/assignments/${assignmentId}/submissions/${submissionId}`,
        );
        return data;
    } catch (error) {
        console.error("Failed delete submission:", error);
        throw error;
    }
}

