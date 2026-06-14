import logging

from app.core.domain.entities.dashboard import DashboardSummary
from app.core.ports.outbound.dashboard_summary_port import DashboardSummaryPort

logger = logging.getLogger(__name__)


class DashboardSummaryUseCase:
    def __init__(self, summary_port: DashboardSummaryPort) -> None:
        self._summary_port = summary_port

    def execute(self, user_id: str, company_id: str) -> DashboardSummary:
        logger.debug("Fetching dashboard summary: user_id=%s, company_id=%s", user_id, company_id)
        summary = self._summary_port.get_summary(user_id=user_id, company_id=company_id)
        logger.debug("Dashboard summary fetched: user_id=%s", user_id)
        return summary
