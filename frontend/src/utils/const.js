// Use environment variable for backend base URL
const API_BASE = import.meta.env.VITE_API_BASE

export const JOB_API_END_POINT = `${API_BASE}/job`;
export const APPLICATION_API_END_POINT = `${API_BASE}/application`;
export const USER_API_END_POINT = `${API_BASE}/user`;
export const COMPANY_API_END_POINT = `${API_BASE}/company`;