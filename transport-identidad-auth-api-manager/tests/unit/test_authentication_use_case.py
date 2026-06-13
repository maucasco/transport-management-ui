"""
TDD — tests escritos ANTES de la implementación.
Validan el núcleo del hexágono sin base de datos ni HTTP.
"""
from unittest.mock import MagicMock

import pytest

from app.core.domain.entities.user import AuthResult, User, UserIdentity
from app.core.domain.exceptions import InactiveUserError, InvalidCredentialsError
from app.core.use_cases.authentication_use_case import AuthenticationUseCase


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


def _make_use_case(
    identity: UserIdentity | None = None,
    user: User | None = None,
    token: str = "jwt.token.here",
    idp_raises: Exception | None = None,
) -> AuthenticationUseCase:
    idp = MagicMock()
    repo = MagicMock()
    tokens = MagicMock()

    if idp_raises:
        idp.verify_credentials.side_effect = idp_raises
    else:
        idp.verify_credentials.return_value = identity or UserIdentity(
            user_id="user-uuid-1", email="admin@empresa.com"
        )

    repo.find_by_id.return_value = user or _make_user()
    tokens.generate_token.return_value = token

    return AuthenticationUseCase(idp=idp, users=repo, tokens=tokens)


class TestLoginSuccess:
    def test_returns_auth_result_with_token_and_user(self) -> None:
        use_case = _make_use_case(token="signed.jwt.abc")

        result = use_case.login("admin@empresa.com", "secret123")

        assert isinstance(result, AuthResult)
        assert result.access_token == "signed.jwt.abc"
        assert result.user.email == "admin@empresa.com"
        assert result.user.role == "admin"

    def test_calls_idp_with_provided_credentials(self) -> None:
        idp = MagicMock()
        idp.verify_credentials.return_value = UserIdentity(user_id="u1", email="x@x.com")
        repo = MagicMock()
        repo.find_by_id.return_value = _make_user()
        tokens = MagicMock()
        tokens.generate_token.return_value = "t"

        use_case = AuthenticationUseCase(idp=idp, users=repo, tokens=tokens)
        use_case.login("admin@empresa.com", "secret123")

        idp.verify_credentials.assert_called_once_with("admin@empresa.com", "secret123")

    def test_generates_token_for_the_authenticated_user(self) -> None:
        user = _make_user()
        tokens = MagicMock()
        tokens.generate_token.return_value = "tok"
        idp = MagicMock()
        idp.verify_credentials.return_value = UserIdentity(user_id=user.id, email=user.email)
        repo = MagicMock()
        repo.find_by_id.return_value = user

        use_case = AuthenticationUseCase(idp=idp, users=repo, tokens=tokens)
        use_case.login(user.email, "pass")

        tokens.generate_token.assert_called_once_with(user)


class TestLoginFailures:
    def test_raises_invalid_credentials_when_idp_rejects(self) -> None:
        use_case = _make_use_case(idp_raises=InvalidCredentialsError())

        with pytest.raises(InvalidCredentialsError):
            use_case.login("bad@email.com", "wrong")

    def test_raises_inactive_user_when_idp_signals_inactive(self) -> None:
        use_case = _make_use_case(idp_raises=InactiveUserError())

        with pytest.raises(InactiveUserError):
            use_case.login("inactive@empresa.com", "pass")

    def test_raises_invalid_credentials_when_user_not_found_in_repo(self) -> None:
        idp = MagicMock()
        idp.verify_credentials.return_value = UserIdentity(user_id="ghost", email="x@x.com")
        repo = MagicMock()
        repo.find_by_id.return_value = None  # usuario no existe en DB
        tokens = MagicMock()

        use_case = AuthenticationUseCase(idp=idp, users=repo, tokens=tokens)

        with pytest.raises(InvalidCredentialsError):
            use_case.login("x@x.com", "pass")
