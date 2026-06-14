from app.core.domain.entities.dashboard import DashboardSummary


class StubDashboardSummaryAdapter:
    def get_summary(self, user_id: str, company_id: str) -> DashboardSummary:
        return DashboardSummary(
            gastos_ejecutados=0.0,
            viaticos=0.0,
            cargas_transportadas=[],
            cargas_asignadas=[],
        )
