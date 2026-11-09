from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.models.cards import CardsBoard
from backend.schemas.cards import Board, CardsResponse

router = APIRouter(prefix="/cards", tags=["cards"])

@router.get("/{board_id}", response_model=CardsResponse)
def get_cards(board_id: int, db: Annotated[Session, Depends(get_db)]) -> CardsBoard:
    row = db.get(CardsBoard, board_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Board not found")
    return row

@router.post("", status_code=201, response_model=CardsResponse)
def new_board(body: Board, db: Annotated[Session, Depends(get_db)]) -> CardsBoard:
    row = CardsBoard(data=body.model_dump(mode="json")["data"])
    db.add(row)
    db.commit()
    db.refresh(row)
    return row

@router.put("/{board_id}", response_model=CardsResponse)
def update_board(board_id: int, body: Board, db: Annotated[Session, Depends(get_db)]) -> CardsBoard:
    row = db.get(CardsBoard, board_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Board not found")
    row.data = body.model_dump(mode="json")["data"]
    db.commit()
    return row


