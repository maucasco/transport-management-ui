import pytest

from app.adapters.outbound.identity.entra_id_adapter import EntraIDAdapter
from app.core.ports.outbound.identity_provider_port import IdentityProviderPort


class TestEntraIDAdapterPort:
    def test_implements_identity_provider_port(self) -> None:
        adapter = EntraIDAdapter()
        assert isinstance(adapter, IdentityProviderPort)

    def test_raises_not_implemented(self) -> None:
        adapter = EntraIDAdapter()
        with pytest.raises(NotImplementedError, match="MVP"):
            adapter.verify_credentials("user@empresa.com", "pass")
