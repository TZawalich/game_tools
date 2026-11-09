from pydantic import BaseModel, ConfigDict
from typing import Any

class Card(BaseModel): 
    id: str
    kind: str
    compact: bool
    content: dict[str, Any]

class Column(BaseModel):
    id: str
    title: str
    cards: list[Card]

class Board(BaseModel):
    data: list[Column]

class CardsResponse(Board):
    model_config = ConfigDict(from_attributes=True)
    id: int
