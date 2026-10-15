import type { ReactNode } from "react";
import styles from "./Card.module.css";

type CardProps = {
    children: ReactNode;
}

const Card = ({children}: CardProps) => (
    <div className={styles.card}>
       <div>{children}</div> 
    </div>
);

export default Card;
