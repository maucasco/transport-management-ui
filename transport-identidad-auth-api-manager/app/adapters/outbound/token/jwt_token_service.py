from datetime import datetime, timedelta, timezone
from typing import Any

from jose import jwt

from app.core.domain.entities.user import User


class JWTTokenService:
    _ALGORITHM = "HS256"

    def __init__(self, secret: str, expire_hours: int = 8) -> None:
        self._secret = secret
        self._expire_hours = expire_hours

    def generate_token(self, user: User) -> str:
        payload: dict[str, Any] = {
            "sub": user.id,
            "email": user.email,
            "role": user.role,
            "company_id": user.company_id,
            "exp": datetime.now(timezone.utc) + timedelta(hours=self._expire_hours),
        }
        return jwt.encode(payload, self._secret, algorithm=self._ALGORITHM)

    def decode_token(self, token: str) -> dict[str, Any]:
        return jwt.decode(token, self._secret, algorithms=[self._ALGORITHM])
