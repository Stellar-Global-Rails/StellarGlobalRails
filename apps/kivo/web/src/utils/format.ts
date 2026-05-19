export const formatDateTime = (value?: string) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
};

export const formatCurrency = (value: number | string, currency = 'USD') =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value));

export const shortId = (value?: string, left = 8, right = 6) => {
  if (!value) return '—';
  if (value.length <= left + right + 3) return value;
  return `${value.slice(0, left)}...${value.slice(-right)}`;
};

export const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    active: 'Ativo',
    suspended: 'Suspenso',
    decommissioned: 'Desativado',
    pending: 'Pendente',
    processing: 'Processando',
    confirmed: 'Confirmado',
    failed: 'Falhou',
    expired: 'Expirado',
    refunded: 'Reembolsado',
    healthy: 'Saudável',
    ready: 'Pronto',
    warning: 'Atenção',
    blocked: 'Bloqueado',
    online: 'Online',
    degraded: 'Degradado',
    offline: 'Offline',
    planned: 'Planejado',
    delayed: 'Atrasado',
    paused: 'Pausado',
    future: 'Futuro',
    delivered: 'Entregue',
    revoked: 'Revogada',
  };
  return map[status] ?? status;
};
