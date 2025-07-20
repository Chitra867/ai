import axios, { AxiosInstance, AxiosResponse } from 'axios';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string | null) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  // Generic HTTP methods
  async get(url: string, config = {}): Promise<AxiosResponse> {
    return this.api.get(url, config);
  }

  async post(url: string, data = {}, config = {}): Promise<AxiosResponse> {
    return this.api.post(url, data, config);
  }

  async put(url: string, data = {}, config = {}): Promise<AxiosResponse> {
    return this.api.put(url, data, config);
  }

  async delete(url: string, config = {}): Promise<AxiosResponse> {
    return this.api.delete(url, config);
  }

  // File upload method
  async uploadFile(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<AxiosResponse> {
    return this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  // Authentication methods
  async login(email: string, password: string) {
    return this.post('/auth/login', { email, password });
  }

  async register(username: string, email: string, password: string) {
    return this.post('/auth/register', { username, email, password });
  }

  async logout() {
    return this.post('/auth/logout');
  }

  async getCurrentUser() {
    return this.get('/auth/me');
  }

  // Dashboard methods
  async getDashboardOverview() {
    return this.get('/dashboard/overview');
  }

  async getThreatTrends(days = 30) {
    return this.get(`/dashboard/threat-trends?days=${days}`);
  }

  async getMalwareStats(days = 30) {
    return this.get(`/dashboard/malware-stats?days=${days}`);
  }

  async getActivityLogs(page = 1, limit = 20) {
    return this.get(`/dashboard/activity-logs?page=${page}&limit=${limit}`);
  }

  // Threat analysis methods
  async analyzeThreatLogs(logData: string, analysisType = 'log_analysis') {
    return this.post('/threats/analyze', { logData, analysisType });
  }

  async getThreatAnalyses(page = 1, limit = 10) {
    return this.get(`/threats?page=${page}&limit=${limit}`);
  }

  async getThreatAnalysis(id: string) {
    return this.get(`/threats/${id}`);
  }

  async getThreatAnalysisStatus(id: string) {
    return this.get(`/threats/${id}/status`);
  }

  async deleteThreatAnalysis(id: string) {
    return this.delete(`/threats/${id}`);
  }

  async getThreatStats(days = 30) {
    return this.get(`/threats/stats/overview?days=${days}`);
  }

  // Malware scanning methods
  async getMalwareScans(page = 1, limit = 10) {
    return this.get(`/malware?page=${page}&limit=${limit}`);
  }

  async getMalwareScan(id: string) {
    return this.get(`/malware/${id}`);
  }

  async getMalwareScanStatus(id: string) {
    return this.get(`/malware/${id}/status`);
  }

  async quarantineFile(id: string) {
    return this.post(`/malware/${id}/quarantine`);
  }

  async deleteMalwareScan(id: string) {
    return this.delete(`/malware/${id}`);
  }

  async getMalwareStatsOverview(days = 30) {
    return this.get(`/malware/stats/overview?days=${days}`);
  }

  // File upload methods
  async uploadFileForScan(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('file', file);
    return this.uploadFile('/upload/scan', formData, onProgress);
  }

  async uploadMultipleFiles(files: File[], onProgress?: (progress: number) => void) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return this.uploadFile('/upload/scan-multiple', formData, onProgress);
  }

  async getUploadStats(days = 30) {
    return this.get(`/upload/stats?days=${days}`);
  }

  // Reports methods
  async generateReport(days = 30, type = 'comprehensive') {
    return this.get(`/reports/generate?days=${days}&type=${type}`);
  }

  async getReportTemplates() {
    return this.get('/reports/templates');
  }

  async getReportHistory(page = 1, limit = 10) {
    return this.get(`/reports/history?page=${page}&limit=${limit}`);
  }

  // Settings methods
  async getSettings() {
    return this.get('/settings');
  }

  async updateSettings(settings: any) {
    return this.put('/settings', settings);
  }

  async getSystemConfig() {
    return this.get('/settings/system');
  }

  async updateSystemConfig(config: any) {
    return this.put('/settings/system', config);
  }

  async getApiKeys() {
    return this.get('/settings/api-keys');
  }

  async createApiKey(name: string, permissions: string[]) {
    return this.post('/settings/api-keys', { name, permissions });
  }

  async revokeApiKey(id: string) {
    return this.delete(`/settings/api-keys/${id}`);
  }

  async testEmail(email?: string) {
    return this.post('/settings/test-email', { email });
  }

  async getNotificationPreferences() {
    return this.get('/settings/notifications');
  }

  async updateNotificationPreferences(preferences: any) {
    return this.put('/settings/notifications', preferences);
  }

  // User profile methods
  async updateProfile(data: any) {
    return this.put('/auth/profile', data);
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.put('/auth/change-password', { currentPassword, newPassword });
  }
}

export const apiService = new ApiService();