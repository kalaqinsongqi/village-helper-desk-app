import api from './auth.js'

export function getUsers(params) {
  return api.get('/users', { params })
}

export function createUser(data) {
  return api.post('/users', data)
}

export function updateUser(id, data) {
  return api.put(`/users/${id}`, data)
}

export function deleteUser(id) {
  return api.delete(`/users/${id}`)
}

export function restoreUser(id) {
  return api.post(`/users/${id}/restore`)
}
