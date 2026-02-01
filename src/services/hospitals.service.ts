import { api } from './api';
import { PaginatedResponse, Doctor } from './doctors.service';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  created_at: string;
}

export interface CreateHospitalDTO {
  name: string;
  address: string;
}

export const hospitalsService = {
  async getAll(page = 1, pageSize = 10): Promise<PaginatedResponse<Hospital>> {
    const response = await api.get<PaginatedResponse<Hospital>>(`/hospitals/?page=${page}&page_size=${pageSize}`);
    return response.data;
  },

  async create(data: CreateHospitalDTO): Promise<Hospital> {
    const response = await api.post<Hospital>('/hospitals/', data);
    return response.data;
  },

  async getById(id: string): Promise<Hospital> {
    const response = await api.get<Hospital>(`/hospitals/${id}`);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/hospitals/${id}`);
  },

  async getDoctors(hospitalId: string, page = 1, pageSize = 10): Promise<PaginatedResponse<Doctor>> {
    const response = await api.get<PaginatedResponse<Doctor>>(`/hospitals/${hospitalId}/doctors/?page=${page}&page_size=${pageSize}`);
    return response.data;
  }
};
