import api from './auth.js'

export function getContracts(params) {
  return api.get('/land/contracts', { params })
}

export function getContractDetail(id) {
  return api.get(`/land/contracts/${id}`)
}

export function createContract(data) {
  return api.post('/land/contracts', data)
}

export function updateContract(id, data) {
  return api.put(`/land/contracts/${id}`, data)
}

export function deleteContract(id) {
  return api.delete(`/land/contracts/${id}`)
}

export function createPlot(contractId, data) {
  return api.post(`/land/contracts/${contractId}/plots`, data)
}

export function updatePlot(plotId, data) {
  return api.put(`/land/plots/${plotId}`, data)
}

export function deletePlot(plotId) {
  return api.delete(`/land/plots/${plotId}`)
}
