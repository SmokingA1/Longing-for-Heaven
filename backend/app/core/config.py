from pydantic_settings import SettingsConfigDict, BaseSettings
from pydantic import EmailStr, model_validator
from typing import ClassVar
from typing_extensions import Self

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="../../../.env",
        env_ignore_empty=True,
        extra="ignore",
    )
    
    # Project
    AVATAR_UPLOAD_DIR: ClassVar[str] = 'static/avatars'
    PRODUCT_UPLOAD_DIR: ClassVar[str] = "static/products"
    PROJECT_NAME: ClassVar[str] = "Longing for Heaven"

    # Database
    DATABASE_USER: str
    DATABASE_PASSWORD: str
    DATABASE_HOST: str
    DATABASE_PORT: int
    DATABASE_DB: str

    @property
    def asyncpg_DB_URL(self):
        return f"postgresql+asyncpg://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_DB}"
    
    # Security
    ALGORITHM: str = "HS256"
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 


    # Admin
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str
    ADMIN_PHONE_NUMBER: str


    #SMTP
    SMTP_TLS: bool = True
    SMTP_SSL: bool = False
    SMTP_HOST: str | None = None
    SMTP_PORT: int = 587

    SMTP_USER: str | None = None
    SMTP_PASSWORD_APP: str | None = None

    EMAILS_FROM_EMAIL: EmailStr | None = None
    EMAILS_FROM_NAME: str | None = None
    
    @model_validator(mode="after")
    def _set_default_emails_from(self) -> Self:
        if not self.EMAILS_FROM_NAME:
            self.EMAILS_FROM_NAME = self.PROJECT_NAME
        return self
    
    @property
    def emails_enabled(self) -> bool:
        return bool(self.EMAILS_FROM_EMAIL and self.SMTP_HOST)
    
    FRONTEND_HOST: str

    #Api
    NOVA_POSHTA_API: str
    
settings = Settings()