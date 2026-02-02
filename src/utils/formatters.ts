export const formatProductionType = (type: string | undefined | null): string => {
  if (!type) return '-';
  const t = type.toLowerCase();

  if (t === 'shift' || t === 'plantao') return 'Plantão';
  if (t === 'consultation' || t === 'consulta') return 'Consulta';

  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

export const formatCurrency = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null) return 'R$ 0,00';
  const num = Number(value);
  if (isNaN(num)) return 'R$ 0,00';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num);
};

export const formatRepasseStatus = (status: string | undefined | null): string => {
  if (!status) return '-';
  const s = status.toLowerCase();

  if (s === 'pending' || s === 'pendente') return 'Pendente';
  if (s === 'consolidated' || s === 'consolidado') return 'Consolidado';
  if (s === 'paid' || s === 'pago') return 'Pago';

  return status;
}
