from app.core.domain.entities.user import UserIdentity
from app.core.ports.outbound.identity_provider_port import IdentityProviderPort


class EntraIDAdapter:
    """Stub for Microsoft Entra ID (Azure AD) identity provider.

    Implements IdentityProviderPort so it can replace PostgreSQLCredentialsAdapter
    in container.py without touching the core. Raises NotImplementedError until v2.
    """

    def verify_credentials(self, email: str, password: str) -> UserIdentity:  # noqa: ARG002
        raise NotImplementedError(
            "Entra ID authentication is not implemented in MVP. "
            "See ADR-002 for the v2 migration path."
        )


def _assert_implements_port() -> None:
    """Checked at import time to guarantee structural compatibility."""
    adapter: IdentityProviderPort = EntraIDAdapter()  # type: ignore[assignment]
    _ = adapter
