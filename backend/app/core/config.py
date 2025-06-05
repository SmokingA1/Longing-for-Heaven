from pydantic_settings import SettingsConfigDict, BaseSettings
from typing import ClassVar

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="../../../.env",
        env_ignore_empty=True,
        extra="ignore",
    )
    
    # Project
    AVATAR_UPLOAD_DIR: ClassVar[str] = 'static/avatars'
    PROJECT_NAME: ClassVar[str] = "Longing for heaven"

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
    ALGORITHM: str = "H256"
    SECRET_KEY: str
    ACCESS_TOKEN_EPXIRE_MINUTES: int = 60 * 24 * 7 

    
settings = Settings()