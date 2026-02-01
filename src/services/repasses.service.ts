import { api } from './api';
import { PaginatedResponse } from './doctors.service';

export interface Repasse {
  id: string;
  production_id: string;
  amount: string;
  valor?: string; // Fallback for legacy API
  status: 'pending' | 'consolidated' | 'pendente' | 'consolidado'; // Support legacy
  created_at: string;
  updated_at?: string;
}

export interface CreateRepasseDTO {
  production_id: string;
  amount: number;
  status?: 'pending' | 'consolidated';
}

export interface RepasseStats {
  doctor_id: string;
  // English fields
  period_start?: string;
  period_end?: string;
  total_pending_count?: number;
  total_pending_value?: string;
  total_consolidated_count?: number;
  total_consolidated_value?: string;
  // Portuguese fields (Legacy Fallback)
  periodo_inicio?: string;
  periodo_fim?: string;
  total_pendente_qtd?: number;
  total_pendente_valor?: string;
  total_consolidado_qtd?: number;
  total_consolidado_valor?: string;
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
