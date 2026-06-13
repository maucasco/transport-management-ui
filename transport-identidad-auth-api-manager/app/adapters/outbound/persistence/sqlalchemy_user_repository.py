from sqlalchemy.orm import Session

from app.adapters.outbound.persistence.models import UserModel
from app.core.domain.entities.user import User


class SQLAlchemyUserRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def find_by_email(self, email: str) -> User | None:
        model = self._session.query(UserModel).filter_by(email=email).first()
        return self._to_domain(model) if model else None

    def find_by_id(self, user_id: str) -> User | None:
        model = self._session.query(UserModel).filter_by(id=user_id).first()
        return self._to_domain(model) if model else None

    @staticmethod
    def _to_domain(model: UserModel) -> User:
        return User(
            id=str(model.id),
            company_id=str(model.company_id),
            email=model.email,
            role=model.role,
            first_name=model.first_name or "",
            last_name=model.last_name or "",
            is_active=model.is_active,
        )
