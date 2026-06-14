from typing import Protocol

from app.core.domain.entities.dashboard import DashboardSummary


class DashboardSummaryPort(Protocol):
    def get_summary(self, user_id: str, company_id: str) -> DashboardSummary:
        ...
