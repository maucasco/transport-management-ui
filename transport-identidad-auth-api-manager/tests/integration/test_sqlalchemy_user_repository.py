import pytest
from sqlalchemy.orm import Session

from app.adapters.outbound.persistence.models import UserModel
from app.adapters.outbound.persistence.sqlalchemy_user_repository import SQLAlchemyUserRepository
from app.core.domain.entities.user import User


class TestFindByEmail:
    def test_returns_user_when_found(self, db_session: Session, active_user: UserModel) -> None:
        repo = SQLAlchemyUserRepository(db_session)
        result = repo.find_by_email("test.admin@test-integration.com")
        assert result is not None
        assert isinstance(result, User)
        assert result.email == "test.admin@test-integration.com"
        assert result.role == "admin"

    def test_returns_none_when_not_found(self, db_session: Session) -> None:
        repo = SQLAlchemyUserRepository(db_session)
        result = repo.find_by_email("notexist@empresa.com")
        assert result is None

    def test_does_not_expose_password_hash(self, db_session: Session, active_user: UserModel) -> None:
        repo = SQLAlchemyUserRepository(db_session)
        result = repo.find_by_email("test.admin@test-integration.com")
        assert result is not None
        assert not hasattr(result, "password_hash")


class TestFindById:
    def test_returns_user_when_found(self, db_session: Session, active_user: UserModel) -> None:
        repo = SQLAlchemyUserRepository(db_session)
        result = repo.find_by_id(str(active_user.id))
        assert result is not None
        assert result.id == str(active_user.id)

    def test_returns_none_when_not_found(self, db_session: Session) -> None:
        repo = SQLAlchemyUserRepository(db_session)
        result = repo.find_by_id("00000000-0000-0000-0000-000000000000")
        assert result is None
