from unittest.mock import MagicMock

import pytest

from app.core.domain.entities.dashboard import DashboardSummary, LoadSummary
from app.core.use_cases.dashboard_summary_use_case import DashboardSummaryUseCase


@pytest.fixture
def stub_port():
    port = MagicMock()
    port.get_summary.return_value = DashboardSummary(
        gastos_ejecutados=0.0,
        viaticos=0.0,
        cargas_transportadas=[],
        cargas_asignadas=[],
    )
    return port


def test_execute_returns_summary(stub_port):
    use_case = DashboardSummaryUseCase(summary_port=stub_port)
    result = use_case.execute(user_id="u-1", company_id="c-1")

    assert isinstance(result, DashboardSummary)
    assert result.gastos_ejecutados == 0.0
    assert result.viaticos == 0.0
    assert result.cargas_transportadas == []
    assert result.cargas_asignadas == []


def test_execute_passes_user_and_company_to_port(stub_port):
    use_case = DashboardSummaryUseCase(summary_port=stub_port)
    use_case.execute(user_id="u-42", company_id="c-99")

    stub_port.get_summary.assert_called_once_with(user_id="u-42", company_id="c-99")


def test_execute_returns_summary_with_loads(stub_port):
    stub_port.get_summary.return_value = DashboardSummary(
        gastos_ejecutados=150.0,
        viaticos=50.0,
        cargas_transportadas=[
            LoadSummary(id="l-1", origin="Bogotá", destination="Medellín", status="completada")
        ],
        cargas_asignadas=[
            LoadSummary(id="l-2", origin="Cali", destination="Bogotá", status="asignada")
        ],
    )
    use_case = DashboardSummaryUseCase(summary_port=stub_port)
    result = use_case.execute(user_id="u-1", company_id="c-1")

    assert result.gastos_ejecutados == 150.0
    assert len(result.cargas_transportadas) == 1
    assert len(result.cargas_asignadas) == 1
