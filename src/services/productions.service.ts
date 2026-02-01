import { api } from './api';
import { PaginatedResponse } from './doctors.service';

export interface Production {
  id: string;
  doctor_id: string;
  hospital_id: string;
  type: 'plantao' | 'consulta';
  date: string;
  description?: string;
  created_at: string;
}

export interface CreateProductionDTO {
  doctor_id: string;
  hospital_id: string;
  type: 'plantao' | 'consulta';
  date: string;
  description?: string;
}

export const productionsService = {
  async getAll(page = 1, pageSize = 10): Promise<PaginatedResponse<Production>> {
    const response = await api.get<PaginatedResponse<Production>>(`/productions/?page=${page}&page_size=${pageSize}`);
    return response.data;
  },

  async create(data: CreateProductionDTO): Promise<Production> {
    const response = await api.post<Production>('/productions/', data);
    return response.data;
  },

  async getById(id: string): Promise<Production> {
    const response = await api.get<Production>(`/productions/${id}`);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/productions/${id}`);
  },

  async getByDoctor(doctorId: string, skip = 0, limit = 100): Promise<Production[]> {
    const response = await api.get<Production[]>(`/productions/doctor/${doctorId}?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  async getByHospital(hospitalId: string, skip = 0, limit = 100): Promise<Production[]> {
    const response = await api.get<Production[]>(`/productions/hospital/${hospitalId}?skip=${skip}&limit=${limit}`);
    return response.data;
  }
};
