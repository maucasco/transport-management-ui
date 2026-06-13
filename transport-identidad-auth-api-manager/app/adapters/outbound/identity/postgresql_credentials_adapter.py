import logging

import bcrypt
from sqlalchemy.orm import Session

from app.adapters.outbound.persistence.models import UserModel
from app.core.domain.entities.user import UserIdentity
from app.core.domain.exceptions import InactiveUserError, InvalidCredentialsError

logger = logging.getLogger(__name__)


class PostgreSQLCredentialsAdapter:
    def __init__(self, session: Session) -> None:
        self._session = session

    def verify_credentials(self, email: str, password: str) -> UserIdentity:
        logger.debug("Validating credentials for email=%s", email)

        model: UserModel | None = self._session.query(UserModel).filter_by(email=email).first()

        if model is None:
            logger.error("Invalid credentials for email=%s — user not found", email)
            raise InvalidCredentialsError()

        if not model.is_active:
            logger.error("User inactive: user_id=%s", model.id)
            raise InactiveUserError()

        if not bcrypt.checkpw(password.encode(), model.password_hash.encode()):
            logger.error("Invalid credentials for email=%s — wrong password", email)
            raise InvalidCredentialsError()

        logger.debug("Credentials valid for email=%s", email)
        return UserIdentity(user_id=str(model.id), email=model.email)
