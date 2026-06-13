from typing import Any, Protocol

from app.core.domain.entities.user import User


class TokenServicePort(Protocol):
    def generate_token(self, user: User) -> str:
        ...

    def decode_token(self, token: str) -> dict[str, Any]:
        ...
