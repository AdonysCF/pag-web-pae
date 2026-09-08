import os

from dotenv import load_dotenv


load_dotenv()


class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "Nursify")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    APP_ENV: str = os.getenv("APP_ENV", "development")

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/nursify",
    )

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "CAMBIAR_ESTA_CLAVE_EN_PRODUCCION",
    )


settings = Settings()