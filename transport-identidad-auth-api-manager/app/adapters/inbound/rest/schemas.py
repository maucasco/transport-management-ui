from pydantic import BaseModel, EmailStr, field_validator


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_must_not_be_empty(cls, v: str) -> str:
        if not v:
            raise ValueError("password must not be empty")
        return v


class UserSchema(BaseModel):
    id: str
    email: str
    role: str
    company_id: str
    first_name: str
    last_name: str


class LoginResponse(BaseModel):
    access_token: str
    user: UserSchema
