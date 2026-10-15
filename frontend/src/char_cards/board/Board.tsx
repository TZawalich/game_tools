import { useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  cardMoved,
  columnAdded,
  columnMoved,
  selectColumns,
  type Card,
  type ColumnId,
} from "./boardSlice";
import Column from "./Column";
import styles from "./Board.module.css";

type CardLayout = Record<ColumnId, Card[]>;

const Board = () => {
  const columns = useAppSelector(selectColumns);
  const dispatch = useAppDispatch();
  // Card positions mid-drag. Local only; redux gets one cardMoved on drop.
  const [dragLayout, setDragLayout] = useState<CardLayout | null>(null);
  const layout: CardLayout =
    dragLayout ?? Object.fromEntries(columns.map((c) => [c.id, c.cards]));

  return (
    <DragDropProvider
      onDragStart={(event) => {
        if (event.operation.source?.type === "card") setDragLayout(layout);
      }}
      onDragOver={(event) => {
        if (event.operation.source?.type !== "card") return;
        setDragLayout((prev) => prev && move(prev, event));
      }}
      onDragEnd={(event) => {
        const { source } = event.operation;
        if (!isSortable(source)) return;

        if (source.type === "card") {
          if (!event.canceled && dragLayout) {
            const cardId = String(source.id);
            for (const [columnId, cards] of Object.entries(dragLayout)) {
              const toIndex = cards.findIndex((c) => c.id === cardId);
              if (toIndex === -1) continue;
              const unchanged =
                columnId === source.initialGroup &&
                toIndex === source.initialIndex;
              if (!unchanged)
                dispatch(cardMoved({ cardId, toColumnId: columnId, toIndex }));
              break;
            }
          }
          setDragLayout(null);
          return;
        }

        if (event.canceled) return;
        const { initialIndex: from, index: to } = source;
        if (from !== to) dispatch(columnMoved({ from, to }));
      }}
    >
      <div className={styles.board}>
        <button
          className={styles.addColumn}
          onClick={() => dispatch(columnAdded())}
        >
          + Add column
        </button>
        {columns.map((column, index) => (
          <Column
            key={column.id}
            column={column}
            cards={layout[column.id]}
            index={index}
          />
        ))}
      </div>
    </DragDropProvider>
  );
};

export default Board;
