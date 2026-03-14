import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

axiosClient.interceptors.request.use(config => {
  const token = useAuthStore.getState().token  // getState() works outside React
  if (token && config.url?.includes('/admin')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosClient