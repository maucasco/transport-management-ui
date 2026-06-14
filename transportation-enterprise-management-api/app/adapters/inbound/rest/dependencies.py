import logging
from dataclasses import dataclass
from typing import Annotated, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.infrastructure.settings import settings

logger = logging.getLogger(__name__)

_bearer = HTTPBearer(auto_error=False)

_ALGORITHM = "HS256"


@dataclass
class TokenClaims:
    user_id: str
    email: str
    role: str
    company_id: str


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
) -> TokenClaims:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload: dict[str, Any] = jwt.decode(
            credentials.credentials,
            settings.jwt_secret,
            algorithms=[_ALGORITHM],
        )
    except JWTError:
        logger.error("Invalid or expired token received")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id: str | None = payload.get("sub")
    email: str | None = payload.get("email")
    role: str | None = payload.get("role")
    company_id: str | None = payload.get("company_id")

    if not all([user_id, email, role, company_id]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token claims",
            headers={"WWW-Authenticate": "Bearer"},
        )

    logger.debug("Token validated: user_id=%s", user_id)
    return TokenClaims(
        user_id=user_id,  # type: ignore[arg-type]
        email=email,  # type: ignore[arg-type]
        role=role,  # type: ignore[arg-type]
        company_id=company_id,  # type: ignore[arg-type]
    )
