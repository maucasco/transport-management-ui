from datetime import datetime, timedelta, timezone

import pytest
from jose import jwt

from app.adapters.outbound.token.jwt_token_service import JWTTokenService
from app.core.domain.entities.user import User

SECRET = "test-secret"
ALGO = "HS256"


def _make_user() -> User:
    return User(
        id="user-uuid-1",
        company_id="company-uuid-1",
        email="admin@empresa.com",
        role="admin",
        first_name="Carlos",
        last_name="López",
        is_active=True,
    )


class TestGenerateToken:
    def test_returns_a_string(self) -> None:
        service = JWTTokenService(secret=SECRET, expire_hours=8)
        token = service.generate_token(_make_user())
        assert isinstance(token, str)
        assert len(token) > 0

    def test_payload_contains_required_claims(self) -> None:
        service = JWTTokenService(secret=SECRET, expire_hours=8)
        token = service.generate_token(_make_user())
        payload = jwt.decode(token, SECRET, algorithms=[ALGO])

        assert payload["sub"] == "user-uuid-1"
        assert payload["email"] == "admin@empresa.com"
        assert payload["role"] == "admin"
        assert payload["company_id"] == "company-uuid-1"
        assert "exp" in payload

    def test_token_expires_in_configured_hours(self) -> None:
        service = JWTTokenService(secret=SECRET, expire_hours=8)
        before = datetime.now(timezone.utc)
        token = service.generate_token(_make_user())
        payload = jwt.decode(token, SECRET, algorithms=[ALGO])

        exp = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
        expected_min = before + timedelta(hours=7, minutes=59)
        expected_max = before + timedelta(hours=8, minutes=1)
        assert expected_min < exp < expected_max


class TestDecodeToken:
    def test_decodes_valid_token(self) -> None:
        service = JWTTokenService(secret=SECRET, expire_hours=8)
        token = service.generate_token(_make_user())
        payload = service.decode_token(token)
        assert payload["sub"] == "user-uuid-1"

    def test_raises_on_invalid_token(self) -> None:
        service = JWTTokenService(secret=SECRET, expire_hours=8)
        with pytest.raises(Exception):
            service.decode_token("not.a.valid.token")

    def test_raises_on_expired_token(self) -> None:
        service = JWTTokenService(secret=SECRET, expire_hours=8)
        payload = {
            "sub": "user-uuid-1",
            "email": "x@x.com",
            "role": "admin",
            "company_id": "c-1",
            "exp": datetime.now(timezone.utc) - timedelta(seconds=1),
        }
        expired_token = jwt.encode(payload, SECRET, algorithm=ALGO)
        with pytest.raises(Exception):
            service.decode_token(expired_token)
