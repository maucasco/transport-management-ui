from typing import Protocol

from app.core.domain.entities.user import UserIdentity


class IdentityProviderPort(Protocol):
    def verify_credentials(self, email: str, password: str) -> UserIdentity:
        """Raises InvalidCredentialsError or InactiveUserError on failure."""
        ...
