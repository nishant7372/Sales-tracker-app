// CSS Styles
import styles from "./NewTransaction.module.css";

//React Imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Hooks Import
import { useFirestore } from "../../hooks/useFirestore";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";

//Components Import
import DataList from "./DataList";

// Transition Import
import { Slide } from "react-awesome-reveal";

export default function NewTransaction() {
  const [name, setName] = useState("");
  const [work, setWork] = useState("");
  const [amount, setAmount] = useState("");
  const [payment, setPayment] = useState("");
  const [number, setNumber] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { user } = useAuthContext();
  const { addDocument, response } = useFirestore("transactions");

  const toSentenceCase = (str) => {
    const sentences = str.toLowerCase().split(" ");

    const sentenceCase = sentences
      .map((sentence) => {
        return sentence.charAt(0).toUpperCase() + sentence.slice(1);
      })
      .join(" ");

    return sentenceCase;
  };

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 1000);
    addDocument({
      name: name.trim(),
      mobileNumber: number,
      work: work.trim(),
      amount: +amount,
      payment,
      uid: user.uid,
    });
  };

  const handleClose = () => {
    navigate("/");
  };

  const handleCheckBox = (e) => {
    if (e.target.checked) {
      setPayment(amount);
    } else {
      setPayment("");
    }
  };
  const { document } = useCollection("transactions", ["uid", "==", user.uid]);

  useEffect(() => {
    if (response.success) {
      setWork("");
      setAmount("");
      setPayment("");
      setName("");
      setNumber("");
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response.success]);

  return (
    <Slide direction="up">
      <div className={styles["form-container"]}>
        <button className={styles["closeButton"]} onClick={handleClose}>
          {" "}
          X{" "}
        </button>
        <form className={styles["customer-form"]} onSubmit={handleSubmit}>
          <h2>💰 new transaction</h2>
          <label>
            <span>Work / Item Purchased</span>
            <input
              list="works"
              className={styles["input"]}
              type="text"
              maxLength="30"
              placeholder="Work / Item Purchased"
              onChange={(e) => setWork(toSentenceCase(e.target.value))}
              value={work}
              required
              autoFocus
            />
            {document && work.length > 0 && (
              <DataList document={document} id="works" param="work" />
            )}
          </label>
          <div className={styles["flex-row"]}>
            <label>
              <span>Name</span>
              <input
                list="names"
                className={styles["input"]}
                type="text"
                maxLength="25"
                placeholder="Customer Name"
                onChange={(e) => setName(toSentenceCase(e.target.value))}
                value={name}
              />
            </label>
            <label>
              <span>Mobile No.</span>
              <input
                className={styles["input"]}
                min="1000000000"
                type="number"
                placeholder="Mobile No."
                onChange={(e) => setNumber(e.target.value)}
                value={number.slice(0, 10)}
              />
              {document && name.length > 0 && (
                <DataList document={document} id="names" param="name" />
              )}
            </label>
          </div>

          <div className={styles["flex-row"]}>
            <label>
              <span>Amount</span>
              <input
                className={styles["input"]}
                type="number"
                max="9999999.00"
                min="1.00"
                placeholder="Amount"
                onChange={(e) => setAmount(e.target.value)}
                value={amount.slice(0, 10)}
                required
              />
            </label>
            <label>
              <span className={styles["payment-label"]}>
                Payment{" "}
                <input
                  title="payment done?"
                  className={styles["done-checkbox"]}
                  type="checkbox"
                  onClick={handleCheckBox}
                />{" "}
              </span>
              <input
                className={styles["input"]}
                type="number"
                min="0.00"
                max={amount}
                placeholder="Payment"
                onChange={(e) => setPayment(e.target.value)}
                value={payment.slice(0, amount.length)}
              />
            </label>
          </div>
          <button className={styles["btn"]} disabled={isButtonDisabled}>
            Add
          </button>
        </form>
      </div>
    </Slide>
  );
}
