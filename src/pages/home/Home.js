import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import styles from "./Home.module.css";
import TransactionList from "./TransactionList";
import { useCollection } from "../../hooks/useCollection";
import { Fade, Slide } from "react-awesome-reveal";
import PieChart from "./PieChart";
import { useEffect, useState } from "react";
import Confirm from "./Confirm";
import { useFirestore } from "../../hooks/useFirestore";

export default function Home() {
  const now = new Date();
  const oneDayAgo = Math.trunc(Number(now) - 86400000);

  const { user } = useAuthContext();
  const [option, setOption] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [query, setQuery] = useState(oneDayAgo);
  const [activeId, setActiveId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const { deleteDocument } = useFirestore("transactions");

  const deleteDoc = (response, id) => {
    if (response) {
      deleteDocument(id);
    }
    setShowConfirm(false);
  };

  const handleOptionChange = (e) => {
    setOption(e.target.value);
    if (e.target.value === "amount") setQuery(0);
    else setQuery(oneDayAgo);
  };

  const handleOrderChange = (e) => {
    setOrder(e.target.value);
  };

  const { document, isPending, error } = useCollection(
    "transactions",
    ["uid", "==", user.uid],
    ">=",
    query,
    option,
    order
  );

  let totalAmount = 0;
  let totalPayment = 0;
  function calcAmountandPayment() {
    if (document) {
      for (let i = 0; i < document.length; i++) {
        totalPayment += Number(document[i].payment);
        totalAmount += Number(document[i].amount);
      }
    }
  }
  calcAmountandPayment();

  return (
    <div className={styles[`main-container`]}>
      <div className={styles[`transaction-list`]}>
        <Slide triggerOnce direction="down">
          <div className={styles["title-container"]}>
            <div className={styles[`title`]}>
              <div>Transactions:</div>
              <div className={styles["filter"]}>
                <div>
                  <select onChange={handleOptionChange}>
                    <option value="createdAt">Created</option>
                    <option value="amount">Amount</option>
                  </select>
                </div>
                {option === "amount" && (
                  <div>
                    <select onChange={handleOrderChange}>
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                )}
                {option === "createdAt" && (
                  <div>
                    <select onChange={handleOrderChange}>
                      <option value="desc">MostRecent</option>
                      <option value="asc">LeastRecent</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Slide>
        {isPending && <div>Loading Transactions...</div>}
        {error && <div>{error}</div>}
        <Fade>
          {document && (
            <TransactionList
              document={document}
              setActiveId={setActiveId}
              setShowConfirm={setShowConfirm}
            />
          )}
        </Fade>
      </div>
      <div className={styles["right-section"]}>
        <div>
          <Link to="/newcustomer">Add new Transaction</Link>
        </div>
        <div>
          <PieChart totalAmount={totalAmount} totalPayment={totalPayment} />
        </div>
      </div>
      <Fade duration={500} triggerOnce>
        <>{showConfirm && <Confirm id={activeId} deleteDoc={deleteDoc} />}</>
      </Fade>
    </div>
  );
}
