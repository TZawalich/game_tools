import { useSortable } from "@dnd-kit/react/sortable";
import { useAppDispatch } from "../../redux/hooks";
import {
  cardAdded,
  columnRemoved,
  columnRenamed,
  type Card,
  type Column as ColumnData,
} from "./boardSlice";
import { cardKinds, type CardKind } from "./cardKinds";
import SortableCard from "./SortableCard";
import styles from "./Board.module.css";

// cards comes from Board, which swaps in the mid-drag layout while a card is moving.
type ColumnProps = { column: ColumnData; cards: Card[]; index: number };

const Column = ({ column, cards, index }: ColumnProps) => {
  const dispatch = useAppDispatch();
  // Also accepts cards so empty columns can be dropped into.
  // Low collision priority (CollisionPriority.Low) so the cards inside win.
  const { ref, handleRef, isDragging } = useSortable({
    id: column.id,
    index,
    type: "column",
    accept: ["column", "card"],
    collisionPriority: 1,
  });

  const remove = () => {
    const count = column.cards.length;
    if (
      count === 0 ||
      window.confirm(`Delete "${column.title}" and its ${count} card(s)?`)
    ) {
      dispatch(columnRemoved(column.id));
    }
  };

  return (
    <div ref={ref} className={styles.column} data-dragging={isDragging}>
      <header className={styles.columnHeader}>
        <button
          ref={handleRef}
          className={styles.grip}
          aria-label="Drag column"
        >
          ⠿
        </button>
        {/* Commits on blur/Enter, not per keystroke. */}
        <input
          className={styles.title}
          defaultValue={column.title}
          onBlur={(e) =>
            e.target.value !== column.title &&
            dispatch(columnRenamed({ id: column.id, title: e.target.value }))
          }
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        />
        <details className={styles.menu}>
          <summary aria-label="Column menu">⋯</summary>
          {(Object.keys(cardKinds) as CardKind[]).map((kind) => (
            <button
              key={kind}
              onClick={() => dispatch(cardAdded(column.id, kind))}
            >
              Add {cardKinds[kind].label}
            </button>
          ))}
          <button onClick={remove}>Delete column</button>
        </details>
      </header>
      <div className={styles.cardList}>
        {cards.map((card, i) => (
          <SortableCard
            key={card.id}
            card={card}
            index={i}
            columnId={column.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
