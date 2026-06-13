"""
Tests de integración para POST /entreprise/authentication/login.
Usa los datos del seed (scripts/seed.sql) — deben estar en la DB antes de correr.
Credenciales seed: admin@empresa.com / admin123
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app

CLIENT = TestClient(app, raise_server_exceptions=False)


class TestLoginSuccess:
    def test_returns_200_with_access_token_and_user(self) -> None:
        resp = CLIENT.post(
            "/entreprise/authentication/login",
            json={"email": "admin@empresa.com", "password": "admin123"},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert "access_token" in body
        assert isinstance(body["access_token"], str)
        assert len(body["access_token"]) > 0

    def test_response_user_has_required_fields(self) -> None:
        resp = CLIENT.post(
            "/entreprise/authentication/login",
            json={"email": "admin@empresa.com", "password": "admin123"},
        )
        user = resp.json()["user"]
        assert user["email"] == "admin@empresa.com"
        assert user["role"] == "admin"
        assert "id" in user
        assert "company_id" in user
        assert "password_hash" not in user

    def test_conductor_can_also_login(self) -> None:
        resp = CLIENT.post(
            "/entreprise/authentication/login",
            json={"email": "conductor@empresa.com", "password": "admin123"},
        )
        assert resp.status_code == 200
        assert resp.json()["user"]["role"] == "conductor"


class TestLoginFailures:
    def test_returns_401_for_wrong_password(self) -> None:
        resp = CLIENT.post(
            "/entreprise/authentication/login",
            json={"email": "admin@empresa.com", "password": "wrong"},
        )
        assert resp.status_code == 401
        assert "detail" in resp.json()

    def test_returns_401_for_unknown_email(self) -> None:
        resp = CLIENT.post(
            "/entreprise/authentication/login",
            json={"email": "ghost@empresa.com", "password": "admin123"},
        )
        assert resp.status_code == 401

    def test_returns_403_for_inactive_user(self) -> None:
        resp = CLIENT.post(
            "/entreprise/authentication/login",
            json={"email": "inactive@empresa.com", "password": "admin123"},
        )
        assert resp.status_code == 403
        assert "detail" in resp.json()


class TestLoginValidation:
    def test_returns_422_for_invalid_email_format(self) -> None:
        resp = CLIENT.post(
            "/entreprise/authentication/login",
            json={"email": "not-an-email", "password": "admin123"},
        )
        assert resp.status_code == 422

    def test_returns_422_for_missing_password(self) -> None:
        resp = CLIENT.post(
            "/entreprise/authentication/login",
            json={"email": "admin@empresa.com"},
        )
        assert resp.status_code == 422

    def test_returns_422_for_empty_password(self) -> None:
        resp = CLIENT.post(
            "/entreprise/authentication/login",
            json={"email": "admin@empresa.com", "password": ""},
        )
        assert resp.status_code == 422

    def test_returns_422_for_missing_body(self) -> None:
        resp = CLIENT.post("/entreprise/authentication/login")
        assert resp.status_code == 422
