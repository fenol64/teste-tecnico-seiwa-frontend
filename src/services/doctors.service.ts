import { api } from './api';

export interface Doctor {
  id: string;
  name: string;
  crm: string;
  specialty: string;
  phone?: string;
  email: string;
  created_at: string;
}

export interface CreateDoctorDTO {
  name: string;
  crm: string;
  specialty: string;
  phone?: string;
  email: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const doctorsService = {
  async getAll(page = 1, pageSize = 10): Promise<PaginatedResponse<Doctor>> {
    const response = await api.get<PaginatedResponse<Doctor>>(`/doctors/?page=${page}&page_size=${pageSize}`);
    return response.data;
  },

  async getById(id: string): Promise<Doctor> {
     const response = await api.get<Doctor>(`/doctors/${id}`);
     return response.data;
  },

  async create(data: CreateDoctorDTO): Promise<Doctor> {
    const response = await api.post<Doctor>('/doctors/', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateDoctorDTO>): Promise<Doctor> {
    const response = await api.put<Doctor>(`/doctors/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/doctors/${id}`);
  },
};
