"""
Tests de integración para GET /entreprise/authentication/me.
Usa los datos del seed (admin@empresa.com / admin123).
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app

CLIENT = TestClient(app, raise_server_exceptions=False)

_LOGIN_URL = "/entreprise/authentication/login"
_ME_URL = "/entreprise/authentication/me"


def _get_valid_token(email: str = "admin@empresa.com", password: str = "admin123") -> str:
    resp = CLIENT.post(_LOGIN_URL, json={"email": email, "password": password})
    assert resp.status_code == 200
    return resp.json()["access_token"]


class TestMeSuccess:
    def test_returns_200_with_user_profile(self) -> None:
        token = _get_valid_token()
        resp = CLIENT.get(_ME_URL, headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 200
        body = resp.json()
        assert body["email"] == "admin@empresa.com"
        assert body["role"] == "admin"
        assert "id" in body
        assert "company_id" in body

    def test_response_does_not_expose_password_hash(self) -> None:
        token = _get_valid_token()
        resp = CLIENT.get(_ME_URL, headers={"Authorization": f"Bearer {token}"})
        assert "password_hash" not in resp.json()

    def test_conductor_token_returns_conductor_profile(self) -> None:
        token = _get_valid_token(email="conductor@empresa.com")
        resp = CLIENT.get(_ME_URL, headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 200
        assert resp.json()["role"] == "conductor"


class TestMeUnauthorized:
    def test_returns_401_when_no_authorization_header(self) -> None:
        resp = CLIENT.get(_ME_URL)
        assert resp.status_code == 401

    def test_returns_401_for_malformed_token(self) -> None:
        resp = CLIENT.get(_ME_URL, headers={"Authorization": "Bearer not.a.jwt"})
        assert resp.status_code == 401

    def test_returns_401_for_tampered_token(self) -> None:
        token = _get_valid_token()
        tampered = token[:-4] + "XXXX"
        resp = CLIENT.get(_ME_URL, headers={"Authorization": f"Bearer {tampered}"})
        assert resp.status_code == 401

    def test_returns_401_for_wrong_scheme(self) -> None:
        token = _get_valid_token()
        resp = CLIENT.get(_ME_URL, headers={"Authorization": f"Token {token}"})
        assert resp.status_code == 401
