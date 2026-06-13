from sqlalchemy.orm import Session

from app.adapters.outbound.identity.postgresql_credentials_adapter import PostgreSQLCredentialsAdapter
from app.adapters.outbound.persistence.sqlalchemy_user_repository import SQLAlchemyUserRepository
from app.adapters.outbound.token.jwt_token_service import JWTTokenService
from app.core.use_cases.authentication_use_case import AuthenticationUseCase
from app.infrastructure.settings import settings


def get_authentication_use_case(session: Session) -> AuthenticationUseCase:
    return AuthenticationUseCase(
        idp=PostgreSQLCredentialsAdapter(session),
        users=SQLAlchemyUserRepository(session),
        tokens=JWTTokenService(
            secret=settings.jwt_secret,
            expire_hours=settings.jwt_expire_hours,
        ),
    )
