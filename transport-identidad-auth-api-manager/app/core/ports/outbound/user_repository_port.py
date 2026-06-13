from typing import Protocol

from app.core.domain.entities.user import User


class UserRepositoryPort(Protocol):
    def find_by_email(self, email: str) -> User | None:
        ...

    def find_by_id(self, user_id: str) -> User | None:
        ...
