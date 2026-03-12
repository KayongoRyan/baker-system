import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const getProducts = () => api.get('/products')
export const getProductsAll = () => api.get('/products/all')
export const getProduct = (id) => api.get(`/products/${id}`)
export const createProduct = (data) => api.post('/products', data)
export const updateProduct = (id, data) => api.put(`/products/${id}`, data)
export const deleteProduct = (id) => api.delete(`/products/${id}`)

export const getOrders = (params) => api.get('/orders', { params })
export const getOrder = (id) => api.get(`/orders/${id}`)
export const createOrder = (data) => api.post('/orders', data)
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}`, { status })

export const createUser = (data) => api.post('/users', data)
export const getUser = (id) => api.get(`/users/${id}`)

export const getInventory = () => api.get('/inventory')
export const getLowStock = () => api.get('/inventory/low-stock')
export const updateInventory = (id, data) => api.put(`/inventory/${id}`, data)

export const getSalesReport = (params) => api.get('/reports/sales', { params })
export const getTopProducts = (limit) => api.get('/reports/top-products', { params: { limit } })
export const getSalesOverview = (days) => api.get('/reports/sales-overview', { params: { days } })

export default api
