import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import styles from "./Home.module.css";
import TransactionList from "./TransactionList";
import { useCollection } from "../../hooks/useCollection";
import { Fade, Slide } from "react-awesome-reveal";
import PieChart from "../../Components/Charts/PieChart";
import { useState } from "react";
import Confirm from "./Confirm";
import { useFirestore } from "../../hooks/useFirestore";

export default function Home() {
  const now = new Date();
  const oneDayAgo = Math.trunc(Number(now) - 86400000);

  const { user } = useAuthContext();

  const [option, setOption] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [groupBy, setGroupBy] = useState(null);

  const [timeQuery, setTimeQuery] = useState(oneDayAgo);

  const [activeId, setActiveId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const { deleteDocument } = useFirestore("transactions");

  const deleteDoc = (response, id) => {
    if (response) {
      deleteDocument(id);
    }
    setShowConfirm(false);
  };

  const handleTimeOptionChange = (val) => {
    if (val === "all") {
      setTimeQuery(null);
    } else if (val === "last24hr") {
      setTimeQuery(oneDayAgo);
    }
  };

  const handleGroupOptionChange = (val) => {
    if (val === "none") {
      setGroupBy(null);
    } else setGroupBy(val);
  };

  const handleOptionChange = (val) => {
    setOption(val);
    setOrder("desc");
  };

  const handleOrderChange = (val) => {
    setOrder(val);
  };

  const { document, isPending, error } = useCollection(
    "transactions",
    ["uid", "==", user.uid],
    ">=",
    timeQuery,
    option,
    order,
    groupBy
  );

  let totalAmount = 0;
  let totalPayment = 0;
  const calcAmountandPayment = () => {
    if (document) {
      for (let i = 0; i < document.length; i++) {
        totalPayment += Number(document[i].payment);
        totalAmount += Number(document[i].amount);
      }
    }
  };
  calcAmountandPayment();

  return (
    <div className={styles[`main-container`]}>
      <div className={styles[`transaction-list`]}>
        <Slide triggerOnce direction="down">
          <div className={styles["title-container"]}>
            <div className={styles["title"]}>💰Transactions</div>
            <div>
              <div className={styles["filter"]}>
                <div>
                  <select
                    onChange={(e) => handleTimeOptionChange(e.target.value)}
                  >
                    <option value="last24hr">Last 24 hours</option>
                    <option value="all">All Transactions</option>
                  </select>
                </div>
                <div className={styles["filter-right"]}>
                  <div>GroupBy:</div>
                  <select
                    onChange={(e) => handleGroupOptionChange(e.target.value)}
                  >
                    <option value="none">None</option>
                    <option value="name">Name</option>
                    <option value="work">Work</option>
                  </select>
                </div>

                <div className={styles["filter-right"]}>
                  <div>
                    <select
                      onChange={(e) => handleOptionChange(e.target.value)}
                    >
                      <option value="createdAt">Created</option>
                      <option value="amount">Amount</option>
                    </select>
                  </div>

                  {option === "amount" && (
                    <div>
                      <select
                        onChange={(e) => handleOrderChange(e.target.value)}
                      >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                      </select>
                    </div>
                  )}
                  {option === "createdAt" && (
                    <div>
                      <select
                        onChange={(e) => handleOrderChange(e.target.value)}
                      >
                        <option value="desc">MostRecent</option>
                        <option value="asc">LeastRecent</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Slide>
        {isPending && <div>Loading Transactions...</div>}
        {error && <div>{error}</div>}
        <Fade>
          {document &&
            groupBy &&
            !Array.isArray(document) &&
            Object.entries(document).map(([key, value]) => (
              <div key={key} className={styles["groupby-list"]}>
                <div className={styles["group-key"]}>
                  <div className={styles["key-name"]}>{key}</div>
                </div>
                <ul>
                  <TransactionList
                    document={value}
                    setActiveId={setActiveId}
                    setShowConfirm={setShowConfirm}
                  />
                </ul>
              </div>
            ))}
          {groupBy === null && document && Array.isArray(document) && (
            <TransactionList
              document={document}
              setActiveId={setActiveId}
              setShowConfirm={setShowConfirm}
            />
          )}
        </Fade>
      </div>
      <div className={styles["right-section"]}>
        <Link to="/new">Add new Transaction</Link>
        <PieChart totalAmount={totalAmount} totalPayment={totalPayment} />
      </div>

      <Fade duration={500} triggerOnce>
        <>{showConfirm && <Confirm id={activeId} deleteDoc={deleteDoc} />}</>
      </Fade>
    </div>
  );
}
