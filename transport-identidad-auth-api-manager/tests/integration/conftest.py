import uuid

import bcrypt
import pytest
from sqlalchemy.orm import Session

from app.adapters.outbound.persistence.models import CompanyModel, UserModel
from app.infrastructure.database import build_engine, build_session_factory
from app.infrastructure.settings import settings


def _hash(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


@pytest.fixture(scope="session")
def db_engine():
    engine = build_engine(settings.database_url)
    yield engine
    engine.dispose()


@pytest.fixture()
def db_session(db_engine) -> Session:  # type: ignore[no-untyped-def]
    """Each test runs inside a transaction that is rolled back after."""
    connection = db_engine.connect()
    transaction = connection.begin()
    factory = build_session_factory(settings.database_url)
    session = factory(bind=connection)  # type: ignore[call-arg]

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture()
def company(db_session: Session) -> CompanyModel:
    obj = CompanyModel(id=uuid.uuid4(), name="Empresa Test", is_active=True)
    db_session.add(obj)
    db_session.flush()
    return obj


@pytest.fixture()
def active_user(db_session: Session, company: CompanyModel) -> UserModel:
    obj = UserModel(
        id=uuid.uuid4(),
        company_id=company.id,
        email="test.admin@test-integration.com",
        password_hash=_hash("password123"),
        role="admin",
        first_name="Carlos",
        last_name="López",
        is_active=True,
    )
    db_session.add(obj)
    db_session.flush()
    return obj


@pytest.fixture()
def inactive_user(db_session: Session, company: CompanyModel) -> UserModel:
    obj = UserModel(
        id=uuid.uuid4(),
        company_id=company.id,
        email="test.inactive@test-integration.com",
        password_hash=_hash("password123"),
        role="conductor",
        first_name="Juan",
        last_name="Pérez",
        is_active=False,
    )
    db_session.add(obj)
    db_session.flush()
    return obj
