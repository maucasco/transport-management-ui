from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://transport_user:transport_pass@localhost:5432/transport_auth"
    jwt_secret: str = "dev-secret-change-in-production"
    jwt_expire_hours: int = 8

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
