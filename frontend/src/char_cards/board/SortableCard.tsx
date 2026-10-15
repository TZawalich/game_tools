import { useSortable } from "@dnd-kit/react/sortable";
import { useAppDispatch } from "../../redux/hooks";
import {
  cardCompactToggled,
  cardRemoved,
  type Card as CardData,
  type ColumnId,
} from "./boardSlice";
import { cardKinds } from "./cardKinds";
import Card from "../components/Card";
import styles from "./Board.module.css";

type SortableCardProps = { card: CardData; index: number; columnId: ColumnId };

const SortableCard = ({ card, index, columnId }: SortableCardProps) => {
  const dispatch = useAppDispatch();
  const { ref, isDragging } = useSortable({
    id: card.id,
    index,
    group: columnId,
    type: "card",
    accept: "card",
  });

  return (
    <div ref={ref} className={styles.cardSlot} data-dragging={isDragging}>
      {/* TODO: render by card.kind: Char/SimpleChar, Mons/SimpleMons depending on compact */}
      <Card>
        <button onClick={() => dispatch(cardCompactToggled(card.id))}>
          {card.compact ? "Expand" : "Collapse"}
        </button>
        <button onClick={() => dispatch(cardRemoved(card.id))}>Remove</button>
        {card.content.name}
        {!card.compact && (
          <div>(full {cardKinds[card.kind].label} fields go here)</div>
        )}
      </Card>
    </div>
  );
};

export default SortableCard;
