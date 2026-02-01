import { api } from './api';
import { PaginatedResponse } from './doctors.service';

export interface Repasse {
  id: string;
  production_id: string;
  valor: string; // The API returns number as string in the example schema sometimes? Swagger says 'total_pendente_valor' is string, but CreateRepasseDTO 'valor' is number or string. Let's use string for safety as money.
  status: 'pendente' | 'consolidado';
  created_at: string;
  updated_at?: string;
}

export interface CreateRepasseDTO {
  production_id: string;
  valor: number;
  status?: 'pendente' | 'consolidado';
}

export interface RepasseStats {
  doctor_id: string;
  periodo_inicio?: string;
  periodo_fim?: string;
  total_pendente_qtd: number;
  total_pendente_valor: string;
  total_consolidado_qtd: number;
  total_consolidado_valor: string;
}

export const repassesService = {
  async getAll(page = 1, pageSize = 10): Promise<PaginatedResponse<Repasse>> {
    const response = await api.get<PaginatedResponse<Repasse>>(`/repasses/?page=${page}&page_size=${pageSize}`);
    return response.data;
  },

  async create(data: CreateRepasseDTO): Promise<Repasse> {
    const response = await api.post<Repasse>('/repasses/', data);
    return response.data;
  },

  async getById(id: string): Promise<Repasse> {
    const response = await api.get<Repasse>(`/repasses/${id}`);
    return response.data;
  },

   async update(id: string, data: Partial<CreateRepasseDTO>): Promise<Repasse> {
    const response = await api.put<Repasse>(`/repasses/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/repasses/${id}`);
  },

  async getStats(doctorId: string): Promise<RepasseStats> {
      const response = await api.get<RepasseStats>(`/repasses/stats/${doctorId}`);
      return response.data;
  },

  async getByHospital(hospitalId: string): Promise<Repasse[]> {
    const response = await api.get<Repasse[]>(`/repasses/hospital/${hospitalId}`);
    return response.data;
  }
};
