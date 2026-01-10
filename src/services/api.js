const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    async loginWithWallet(walletAddress, role) {
        const data = await this.request('/auth/wallet-login', {
            method: 'POST',
            body: JSON.stringify({ walletAddress, role }),
        });
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    async getProfile() {
        return this.request('/auth/profile');
    }

    // Report endpoints
    async uploadReport(formData) {
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_BASE_URL}/reports/upload`, {
            method: 'POST',
            headers,
            body: formData, // Don't set Content-Type for FormData
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
        }
        return data;
    }

    async getReports() {
        return this.request('/reports');
    }

    async getReport(id) {
        return this.request(`/reports/${id}`);
    }

    async downloadReport(id) {
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_BASE_URL}/reports/${id}/download`, {
            headers,
        });

        if (!response.ok) {
            throw new Error('Download failed');
        }

        return response.blob();
    }

    // Access control endpoints
    async requestAccess(data) {
        return this.request('/access/request', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getAccessRequests() {
        return this.request('/access/requests');
    }

    async grantAccess(requestId, expiresInDays) {
        return this.request('/access/grant', {
            method: 'POST',
            body: JSON.stringify({ requestId, expiresInDays }),
        });
    }

    async revokeAccess(requestId) {
        return this.request('/access/revoke', {
            method: 'POST',
            body: JSON.stringify({ requestId }),
        });
    }

    async getPermissions() {
        return this.request('/access/permissions');
    }

    // Activity logs
    async getActivityLogs() {
        return this.request('/activity');
    }

    // Admin endpoints
    async getDoctors() {
        return this.request('/admin/doctors');
    }

    async verifyDoctor(doctorId, isVerified) {
        return this.request(`/admin/verify-doctor/${doctorId}`, {
            method: 'PUT',
            body: JSON.stringify({ isVerified }),
        });
    }

    async getAdminStats() {
        return this.request('/admin/stats');
    }

    async getAdminLogs() {
        return this.request('/admin/logs');
    }

    // Diagnosis endpoints
    async uploadDiagnosis(formData) {
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_BASE_URL}/diagnosis/upload`, {
            method: 'POST',
            headers,
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
        }
        return data;
    }

    async getDiagnosesForReport(reportId) {
        return this.request(`/diagnosis/report/${reportId}`);
    }

    async getPatientDiagnoses() {
        return this.request('/diagnosis/patient');
    }
}

export default new ApiService();
