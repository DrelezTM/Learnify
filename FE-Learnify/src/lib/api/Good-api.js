import { baseAxios } from "../baseAxios";


export async function fetchLetters() {
    try {
        const { data } = await baseAxios.get("/letters");
        return data;
    } catch (error) {
        console.error('Failed to fetch letters:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
}

export async function fetchLetterDetail(id) {
    try {
        const { data } = await baseAxios.get(`/letters/${id}`);
        return data;
    } catch (error) {
        console.error('Failed to fetch letter detail:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
}

export async function submitLetter(formData) {
    try {
        console.log('Submitting letter with data:', {
            letter_type: formData.get('letter_type'),
            reason: formData.get('reason'),
            has_file: !!formData.get('uploaded_file')
        });

        const { data } = await baseAxios.post("/letters", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log('Submit success:', data);
        return data;
    } catch (error) {
        console.error('Failed to submit letter:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);
        
        if (error.response) {
            const errorMsg = error.response.data?.message || 
                           error.response.data?.error || 
                           `Server error: ${error.response.status}`;
            throw new Error(errorMsg);
        } else if (error.request) {
            throw new Error('Tidak dapat menghubungi server. Periksa koneksi Anda.');
        } else {
            throw new Error('Terjadi kesalahan: ' + error.message);
        }
    }
}


export async function fetchAdminLetters() {
    try {
        const { data } = await baseAxios.get("/admin/letters");
        return data;
    } catch (error) {
        console.error('Failed to fetch admin letters:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
}

export async function fetchAdminLetterDetail(id) {
    try {
        const { data } = await baseAxios.get(`/admin/letters/${id}`);
        return data;
    } catch (error) {
        console.error('Failed to fetch admin letter detail:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
}

export async function updateLetterStatus(id, status) {
    try {
        const { data } = await baseAxios.post(`/admin/letters/${id}/status`, {
            status: status // pending, approved, rejected
        });
        
        console.log('Status updated:', data);
        return data;
    } catch (error) {
        console.error('Failed to update letter status:', error);
        console.error('Error response:', error.response?.data);
        
        if (error.response) {
            const errorMsg = error.response.data?.message || 
                           error.response.data?.error || 
                           `Server error: ${error.response.status}`;
            throw new Error(errorMsg);
        } else {
            throw new Error('Gagal update status: ' + error.message);
        }
    }
}

export async function uploadLetterResult(id, file) {
    try {
        const formData = new FormData();
        formData.append('result_file', file);

        const { data } = await baseAxios.post(`/admin/letters/${id}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log('Result uploaded:', data);
        return data;
    } catch (error) {
        console.error('Failed to upload result:', error);
        console.error('Error response:', error.response?.data);
        
        if (error.response) {
            const errorMsg = error.response.data?.message || 
                           error.response.data?.error || 
                           `Server error: ${error.response.status}`;
            throw new Error(errorMsg);
        } else {
            throw new Error('Gagal upload hasil surat: ' + error.message);
        }
    }
}


export async function fetchLectureApprovals() {
    try {
        const { data } = await baseAxios.get("/lecture/approvals");
        return data;
    } catch (error) {
        console.error('Failed to fetch lecture approvals:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
}

export async function updateLectureApproval(id, status) {
    try {
        const { data } = await baseAxios.put(`/lecture/approvals/${id}`, {
            status: status 
        });
        
        console.log('Approval updated:', data);
        return data;
    } catch (error) {
        console.error('Failed to update approval:', error);
        console.error('Error response:', error.response?.data);
        
        if (error.response) {
            const errorMsg = error.response.data?.message || 
                           error.response.data?.error || 
                           `Server error: ${error.response.status}`;
            throw new Error(errorMsg);
        } else {
            throw new Error('Gagal update approval: ' + error.message);
        }
    }
}


export async function fetchLettersByRole(role) {
    switch(role) {
        case 'admin':
            return await fetchAdminLetters();
        case 'lecturer':
            return await fetchLectureApprovals();
        case 'student':
        default:
            return await fetchLetters();
    }
}

export async function fetchLetterDetailByRole(role, id) {
    switch(role) {
        case 'admin':
            return await fetchAdminLetterDetail(id);
        case 'student':
        default:
            return await fetchLetterDetail(id);
    }
}