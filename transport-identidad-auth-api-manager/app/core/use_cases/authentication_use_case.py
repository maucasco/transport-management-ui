from app.core.domain.entities.user import AuthResult, User
from app.core.domain.exceptions import InvalidCredentialsError
from app.core.ports.outbound.identity_provider_port import IdentityProviderPort
from app.core.ports.outbound.token_service_port import TokenServicePort
from app.core.ports.outbound.user_repository_port import UserRepositoryPort


class AuthenticationUseCase:
    def __init__(
        self,
        idp: IdentityProviderPort,
        users: UserRepositoryPort,
        tokens: TokenServicePort,
    ) -> None:
        self._idp = idp
        self._users = users
        self._tokens = tokens

    def login(self, email: str, password: str) -> AuthResult:
        # Raises InvalidCredentialsError or InactiveUserError if auth fails
        identity = self._idp.verify_credentials(email, password)

        user: User | None = self._users.find_by_id(identity.user_id)
        if user is None:
            raise InvalidCredentialsError()

        token = self._tokens.generate_token(user)
        return AuthResult(access_token=token, user=user)
