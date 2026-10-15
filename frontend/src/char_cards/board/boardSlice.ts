import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../redux/store";
import { cardKinds, type CardContentByKind, type CardKind } from "./cardKinds";

export type CardId = string;
export type ColumnId = string;

// One variant per kind, so checking card.kind narrows card.content.
export type Card = {
  [K in CardKind]: {
    id: CardId;
    kind: K;
    compact: boolean;
    content: CardContentByKind[K];
  };
}[CardKind];

export type Column = { id: ColumnId; title: string; cards: Card[] };

type BoardState = { columns: Column[] };

const initialState: BoardState = { columns: [] };

const moveItem = <T>(list: T[], from: number, to: number) => {
  const [item] = list.splice(from, 1);
  list.splice(to, 0, item);
};

// Cards are nested, so lookups search the columns. Fine at encounter-sized boards.
const findCard = (state: BoardState, cardId: CardId) => {
  for (const column of state.columns) {
    const index = column.cards.findIndex((card) => card.id === cardId);
    if (index !== -1) return { column, index };
  }
  return undefined;
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    columnAdded: {
      reducer(state, action: PayloadAction<Column>) {
        state.columns.push(action.payload);
      },
      prepare() {
        return { payload: { id: nanoid(), title: "New Column", cards: [] } };
      },
    },
    columnRenamed(
      state,
      action: PayloadAction<{ id: ColumnId; title: string }>,
    ) {
      const column = state.columns.find((c) => c.id === action.payload.id);
      if (column) column.title = action.payload.title;
    },
    // Takes its cards with it.
    columnRemoved(state, action: PayloadAction<ColumnId>) {
      state.columns = state.columns.filter((c) => c.id !== action.payload);
    },
    columnMoved(state, action: PayloadAction<{ from: number; to: number }>) {
      moveItem(state.columns, action.payload.from, action.payload.to);
    },
    cardAdded: {
      reducer(
        state,
        action: PayloadAction<{ columnId: ColumnId; card: Card }>,
      ) {
        const column = state.columns.find(
          (c) => c.id === action.payload.columnId,
        );
        if (column) column.cards.push(action.payload.card);
      },
      prepare(columnId: ColumnId, kind: CardKind) {
        const card = {
          id: nanoid(),
          kind,
          compact: false,
          content: cardKinds[kind].blank(),
        } as Card;
        return { payload: { columnId, card } };
      },
    },
    // Replaces the whole card; editors hand back the updated card.
    cardUpdated(state, action: PayloadAction<Card>) {
      const found = findCard(state, action.payload.id);
      if (found) found.column.cards[found.index] = action.payload;
    },
    cardCompactToggled(state, action: PayloadAction<CardId>) {
      const found = findCard(state, action.payload);
      if (found) {
        const card = found.column.cards[found.index];
        card.compact = !card.compact;
      }
    },
    cardRemoved(state, action: PayloadAction<CardId>) {
      const found = findCard(state, action.payload);
      if (found) found.column.cards.splice(found.index, 1);
    },
    cardMoved(
      state,
      action: PayloadAction<{
        cardId: CardId;
        toColumnId: ColumnId;
        toIndex: number;
      }>,
    ) {
      const { cardId, toColumnId, toIndex } = action.payload;
      const found = findCard(state, cardId);
      const to = state.columns.find((c) => c.id === toColumnId);
      if (!found || !to) return;
      const [card] = found.column.cards.splice(found.index, 1);
      to.cards.splice(toIndex, 0, card);
    },
  },
});

export const {
  columnAdded,
  columnRenamed,
  columnRemoved,
  columnMoved,
  cardAdded,
  cardUpdated,
  cardCompactToggled,
  cardRemoved,
  cardMoved,
} = boardSlice.actions;
export const selectColumns = (state: RootState) => state.board.columns;
export default boardSlice.reducer;
