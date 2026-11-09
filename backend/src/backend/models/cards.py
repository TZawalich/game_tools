from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB
from typing import Any
from backend.db import Base

class CardsBoard(Base):
    __tablename__ = "cards"
    id: Mapped[int] = mapped_column(primary_key=True)
    data: Mapped[list[dict[str, Any]]] = mapped_column(JSONB)
