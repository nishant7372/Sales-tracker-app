import { useState } from "react";
import styles from "./TransactionList.module.css";
import PieChart from "./PieChart";
import { Slide } from "react-awesome-reveal";
import { useFirestore } from "../../hooks/useFirestore";
import TransactionDetails from "./TransactionDetails";
import { keyframes } from "@emotion/react";
import { NavLink } from "react-router-dom";

export default function TransactionList({ document }) {
  const [showIndex, setShowIndex] = useState(-1);
  const { deleteDocument } = useFirestore("transactions");
  const handleClick = (index) => {
    setShowIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const customAnimation1 = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0px, -60px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

  const customAnimation2 = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0,-20px,-20px);
  }

  to {
    opacity: 1;
    transform: translate3d(0,0,0);
  }
`;
  return (
    <ul
      className={`
    ${styles[`container`]} ${
        styles[document.length === 0 ? `no-padding` : ``]
      }`}
    >
      {document.map((doc, index) => (
        <Slide cascade key={doc.id} keyframes={customAnimation2}>
          <li key={doc.id}>
            <div
              className={`
                ${styles[`card`]} ${
                styles[doc.amount > doc.payment ? "pending" : "success"]
              } ${
                styles[showIndex !== index ? `card-border` : `card-noborder`]
              }`}
              onClick={() => handleClick(index)}
            >
              <div className={styles.name}>{doc.work}</div>
              <div className={styles["right-section"]}>
                <div className={styles.amount}>
                  ₹ {doc.payment.padStart(1, 0)}
                </div>
                <div
                  className={`${styles["cross"]} ${styles["deleteButton"]}`}
                  onClick={() => deleteDocument(doc.id)}
                >
                  X
                </div>
              </div>
            </div>
            {showIndex === index && (
              <Slide
                direction="down"
                triggerOnce
                className={styles["lower-section"]}
                keyframes={customAnimation1}
              >
                <div>
                  <TransactionDetails doc={doc} />
                </div>
              </Slide>
            )}
          </li>
        </Slide>
      ))}
    </ul>
  );
}
