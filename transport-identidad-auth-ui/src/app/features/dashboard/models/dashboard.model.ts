export interface LoadSummary {
  id: string;
  origin: string;
  destination: string;
  status: string;
}

export interface DashboardSummary {
  gastos_ejecutados: number;
  viaticos: number;
  cargas_transportadas: LoadSummary[];
  cargas_asignadas: LoadSummary[];
}
