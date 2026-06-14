import logging
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.adapters.outbound.persistence.sqlalchemy_user_repository import SQLAlchemyUserRepository
from app.adapters.outbound.token.jwt_token_service import JWTTokenService
from app.core.domain.entities.user import User
from app.infrastructure.database import get_session
from app.infrastructure.settings import settings

logger = logging.getLogger(__name__)

_bearer = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
    session: Session = Depends(get_session),
) -> User:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_service = JWTTokenService(
        secret=settings.jwt_secret,
        expire_hours=settings.jwt_expire_hours,
    )
    try:
        payload = token_service.decode_token(credentials.credentials)
    except JWTError:
        logger.error("Invalid token received")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id: str | None = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token claims",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = SQLAlchemyUserRepository(session).find_by_id(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    logger.debug("Session validated: user_id=%s", user.id)
    return user
