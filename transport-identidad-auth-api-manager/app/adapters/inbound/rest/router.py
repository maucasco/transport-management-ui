import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.adapters.inbound.rest.schemas import LoginRequest, LoginResponse, UserSchema
from app.core.domain.exceptions import InactiveUserError, InvalidCredentialsError
from app.infrastructure.container import get_authentication_use_case
from app.infrastructure.database import get_session

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/entreprise/authentication", tags=["authentication"])


@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    responses={
        401: {"description": "Invalid credentials"},
        403: {"description": "Account is inactive"},
    },
    summary="Authenticate a user",
    description=(
        "Validates email and password against stored credentials. "
        "Returns a signed JWT (HS256, 8h expiry) and the user profile on success."
    ),
)
def login(request: LoginRequest, session: Session = Depends(get_session)) -> LoginResponse:
    logger.debug("Login attempt for email=%s", request.email)
    use_case = get_authentication_use_case(session)
    try:
        logger.debug("Validating credentials for email=%s", request.email)
        result = use_case.login(request.email, request.password)
        logger.debug("Generating JWT for user_id=%s", result.user.id)
        logger.info(
            "User logged in: email=%s, company_id=%s",
            result.user.email,
            result.user.company_id,
        )
        return LoginResponse(
            access_token=result.access_token,
            user=UserSchema(
                id=result.user.id,
                email=result.user.email,
                role=result.user.role,
                company_id=result.user.company_id,
                first_name=result.user.first_name,
                last_name=result.user.last_name,
            ),
        )
    except InactiveUserError:
        logger.error("User inactive: email=%s", request.email)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive",
        )
    except InvalidCredentialsError:
        logger.error("Invalid credentials for email=%s", request.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
