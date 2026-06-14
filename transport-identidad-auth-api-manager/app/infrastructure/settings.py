from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://transport_user:transport_pass@localhost:5432/transport_auth"
    jwt_secret: str
    jwt_expire_hours: int = 8
    log_level: str = "INFO"
    allowed_origins: list[str] = ["http://localhost:4200"]

    @field_validator("jwt_secret")
    @classmethod
    def jwt_secret_must_be_strong(cls, v: str) -> str:
        if len(v) < 32:
            raise ValueError("JWT_SECRET must be at least 32 characters")
        return v

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
