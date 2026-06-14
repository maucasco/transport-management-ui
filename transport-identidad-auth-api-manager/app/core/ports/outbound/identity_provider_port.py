from typing import Protocol, runtime_checkable

from app.core.domain.entities.user import UserIdentity


@runtime_checkable
class IdentityProviderPort(Protocol):
    def verify_credentials(self, email: str, password: str) -> UserIdentity:
        """Raises InvalidCredentialsError or InactiveUserError on failure."""
        ...
