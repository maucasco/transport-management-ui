from dataclasses import dataclass


@dataclass
class User:
    id: str
    company_id: str
    email: str
    role: str  # "admin" | "conductor"
    first_name: str
    last_name: str
    is_active: bool


@dataclass
class UserIdentity:
    """Resultado mínimo del IDP — solo confirma quién es el usuario."""
    user_id: str
    email: str


@dataclass
class AuthResult:
    access_token: str
    user: User
