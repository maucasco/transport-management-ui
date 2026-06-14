import pytest
from fastapi.testclient import TestClient

from app.main import app

CLIENT = TestClient(app, raise_server_exceptions=False)

_SUMMARY_URL = "/entreprise/dashboard/summary"


class TestDashboardSummarySuccess:
    def test_returns_200_with_valid_token(self, valid_token: str) -> None:
        resp = CLIENT.get(_SUMMARY_URL, headers={"Authorization": f"Bearer {valid_token}"})
        assert resp.status_code == 200

    def test_response_has_correct_structure(self, valid_token: str) -> None:
        resp = CLIENT.get(_SUMMARY_URL, headers={"Authorization": f"Bearer {valid_token}"})
        body = resp.json()
        assert "gastos_ejecutados" in body
        assert "viaticos" in body
        assert "cargas_transportadas" in body
        assert "cargas_asignadas" in body

    def test_stub_returns_zero_values(self, valid_token: str) -> None:
        resp = CLIENT.get(_SUMMARY_URL, headers={"Authorization": f"Bearer {valid_token}"})
        body = resp.json()
        assert body["gastos_ejecutados"] == 0.0
        assert body["viaticos"] == 0.0
        assert body["cargas_transportadas"] == []
        assert body["cargas_asignadas"] == []


class TestDashboardSummaryUnauthorized:
    def test_returns_401_when_no_authorization_header(self) -> None:
        resp = CLIENT.get(_SUMMARY_URL)
        assert resp.status_code == 401

    def test_returns_401_for_expired_token(self, expired_token: str) -> None:
        resp = CLIENT.get(_SUMMARY_URL, headers={"Authorization": f"Bearer {expired_token}"})
        assert resp.status_code == 401

    def test_returns_401_for_malformed_token(self) -> None:
        resp = CLIENT.get(_SUMMARY_URL, headers={"Authorization": "Bearer not.a.jwt"})
        assert resp.status_code == 401

    def test_returns_401_for_wrong_scheme(self) -> None:
        resp = CLIENT.get(_SUMMARY_URL, headers={"Authorization": "Basic dXNlcjpwYXNz"})
        assert resp.status_code == 401
