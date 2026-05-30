import api from './api';

export const mediDoctorService = {
  getConversations: async (patientId) => {
    const response = await api.get(`/medidoctor/patient/${patientId}`);
    return response.data;
  },

  getConversation: async (conversationId) => {
    const response = await api.get(`/medidoctor/${conversationId}`);
    return response.data;
  },

  sendMessage: async (conversationId, patientId, content) => {
    const response = await api.post(`/medidoctor/${conversationId}/messages`, {
      patientId,
      content
    });
    return response.data;
  },
  
  createConsultationRequest: async (data) => {
    const response = await api.post('/consultations', data);
    return response.data;
  },

  getPatientRequests: async (patientId) => {
    const response = await api.get(`/consultations/patient/${patientId}`);
    return response.data;
  },

  getDoctorRequests: async (doctorId) => {
    const response = await api.get(`/consultations/doctor/${doctorId}`);
    return response.data;
  },

  acceptRequest: async (requestId, data) => {
    const response = await api.put(`/consultations/${requestId}/accept`, data);
    return response.data;
  },

  rejectRequest: async (requestId, data) => {
    const response = await api.put(`/consultations/${requestId}/reject`, data);
    return response.data;
  }
};
