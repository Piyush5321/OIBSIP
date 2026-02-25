import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

export const pizzas = {
  list: () => api.get('/pizzas'),
}

export const orders = {
  create: (data) => api.post('/orders', data),
  my: () => api.get('/orders/my'),
  list: () => api.get('/orders'),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  myHistory: () => api.get('/orders/history/my'),
  history: () => api.get('/orders/history'),
}

export const inventory = {
  list: () => api.get('/inventory'),
  update: (id, data) => api.patch(`/inventory/${id}`, data),
}
