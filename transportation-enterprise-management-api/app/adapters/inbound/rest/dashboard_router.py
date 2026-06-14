import logging
from typing import Annotated

from fastapi import APIRouter, Depends

from app.adapters.inbound.rest.dashboard_schemas import DashboardSummaryResponse, LoadSummarySchema
from app.adapters.inbound.rest.dependencies import TokenClaims, get_current_user
from app.adapters.outbound.dashboard.stub_dashboard_summary_adapter import StubDashboardSummaryAdapter
from app.core.use_cases.dashboard_summary_use_case import DashboardSummaryUseCase

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/entreprise/dashboard", tags=["dashboard"])


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
    summary="Get dashboard summary for the authenticated user",
    responses={401: {"description": "Missing, invalid, or expired token"}},
)
def get_dashboard_summary(
    claims: Annotated[TokenClaims, Depends(get_current_user)],
) -> DashboardSummaryResponse:
    logger.info("Dashboard summary requested: user_id=%s", claims.user_id)

    use_case = DashboardSummaryUseCase(summary_port=StubDashboardSummaryAdapter())
    summary = use_case.execute(user_id=claims.user_id, company_id=claims.company_id)

    return DashboardSummaryResponse(
        gastos_ejecutados=summary.gastos_ejecutados,
        viaticos=summary.viaticos,
        cargas_transportadas=[
            LoadSummarySchema(id=c.id, origin=c.origin, destination=c.destination, status=c.status)
            for c in summary.cargas_transportadas
        ],
        cargas_asignadas=[
            LoadSummarySchema(id=c.id, origin=c.origin, destination=c.destination, status=c.status)
            for c in summary.cargas_asignadas
        ],
    )
