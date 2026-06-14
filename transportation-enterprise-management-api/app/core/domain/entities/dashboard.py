from dataclasses import dataclass, field


@dataclass
class LoadSummary:
    id: str
    origin: str
    destination: str
    status: str


@dataclass
class DashboardSummary:
    gastos_ejecutados: float
    viaticos: float
    cargas_transportadas: list[LoadSummary] = field(default_factory=list)
    cargas_asignadas: list[LoadSummary] = field(default_factory=list)
