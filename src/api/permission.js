import api from './auth.js'

export function getPermissions() {
  return api.get('/permissions')
}

export function getUserPermissions(userId) {
  return api.get(`/permissions/user/${userId}`)
}

export function updateUserPermissions(userId, permissionIds) {
  return api.put(`/permissions/user/${userId}`, permissionIds)
}
