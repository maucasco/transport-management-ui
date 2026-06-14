from pydantic import BaseModel


class LoadSummarySchema(BaseModel):
    id: str
    origin: str
    destination: str
    status: str


class DashboardSummaryResponse(BaseModel):
    gastos_ejecutados: float
    viaticos: float
    cargas_transportadas: list[LoadSummarySchema]
    cargas_asignadas: list[LoadSummarySchema]
