from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import model_validator
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="", extra="ignore")

    database_url: str = f"sqlite:///{BASE_DIR / 'worksphere.db'}"
    secret_key: str = "change-this-to-a-random-secret-key-in-production"
    access_token_expire_minutes: int = 480

    @model_validator(mode="after")
    def _anchor_relative_sqlite_path(self) -> "Settings":
        """
        If DATABASE_URL is a relative sqlite path (e.g. "sqlite:///./worksphere.db"
        or "sqlite:///worksphere.db"), resolve it against BASE_DIR instead of
        whatever directory the process happens to be launched from. Without
        this, running `uvicorn` from a different working directory silently
        creates/opens a *different* database file with no error — which looks
        like "my data disappeared" after a restart.
        """
        prefix = "sqlite:///"
        if self.database_url.startswith(prefix):
            raw_path = self.database_url[len(prefix):]
            path_obj = Path(raw_path)
            if not path_obj.is_absolute():
                resolved = (BASE_DIR / path_obj).resolve()
                self.database_url = f"{prefix}{resolved}"
        return self


settings = Settings()
