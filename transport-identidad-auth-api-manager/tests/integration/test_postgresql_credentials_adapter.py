import pytest
from sqlalchemy.orm import Session

from app.adapters.outbound.identity.postgresql_credentials_adapter import PostgreSQLCredentialsAdapter
from app.adapters.outbound.persistence.models import UserModel
from app.core.domain.entities.user import UserIdentity
from app.core.domain.exceptions import InactiveUserError, InvalidCredentialsError


class TestVerifyCredentials:
    def test_returns_user_identity_on_valid_credentials(
        self, db_session: Session, active_user: UserModel
    ) -> None:
        adapter = PostgreSQLCredentialsAdapter(db_session)
        result = adapter.verify_credentials("test.admin@test-integration.com", "password123")
        assert isinstance(result, UserIdentity)
        assert result.email == "test.admin@test-integration.com"
        assert result.user_id == str(active_user.id)

    def test_raises_invalid_credentials_when_email_not_found(self, db_session: Session) -> None:
        adapter = PostgreSQLCredentialsAdapter(db_session)
        with pytest.raises(InvalidCredentialsError):
            adapter.verify_credentials("ghost@empresa.com", "password123")

    def test_raises_invalid_credentials_on_wrong_password(
        self, db_session: Session, active_user: UserModel
    ) -> None:
        adapter = PostgreSQLCredentialsAdapter(db_session)
        with pytest.raises(InvalidCredentialsError):
            adapter.verify_credentials("test.admin@test-integration.com", "wrongpassword")

    def test_raises_inactive_user_when_account_disabled(
        self, db_session: Session, inactive_user: UserModel
    ) -> None:
        adapter = PostgreSQLCredentialsAdapter(db_session)
        with pytest.raises(InactiveUserError):
            adapter.verify_credentials("test.inactive@test-integration.com", "password123")
