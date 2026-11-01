from sqlalchemy import create_engine
from backend.config import settings

from sqlalchemy.orm import DeclarativeBase, Session
from collections.abc import Iterator

engine = create_engine(settings.database_url)

class Base(DeclarativeBase): pass

def get_db() -> Iterator[Session]: 
    with Session(engine) as session:
        yield session
