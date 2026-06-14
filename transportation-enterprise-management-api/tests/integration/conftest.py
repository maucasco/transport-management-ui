import os
from datetime import datetime, timedelta, timezone
from typing import Any

import pytest
from jose import jwt

# Use a fixed test secret so tests are hermetic
TEST_SECRET = "test-secret-that-is-long-enough-32chars"
os.environ.setdefault("JWT_SECRET", TEST_SECRET)

_ALGORITHM = "HS256"


def _make_token(
    user_id: str = "u-test-1",
    email: str = "conductor@empresa.com",
    role: str = "conductor",
    company_id: str = "c-test-1",
    expire_delta: timedelta = timedelta(hours=8),
) -> str:
    payload: dict[str, Any] = {
        "sub": user_id,
        "email": email,
        "role": role,
        "company_id": company_id,
        "exp": datetime.now(timezone.utc) + expire_delta,
    }
    return jwt.encode(payload, TEST_SECRET, algorithm=_ALGORITHM)


@pytest.fixture
def valid_token() -> str:
    return _make_token()


@pytest.fixture
def expired_token() -> str:
    return _make_token(expire_delta=timedelta(hours=-1))
