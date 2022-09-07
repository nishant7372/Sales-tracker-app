// CSS Styles
import styles from "./NewCustomer.module.css";

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
import { Fade, Slide } from "react-awesome-reveal";

export default function NewCustomer() {
  const [name, setName] = useState("");
  const [work, setWork] = useState("");
  const [amount, setAmount] = useState("");
  const [payment, setPayment] = useState("");
  const [number, setNumber] = useState("");

  const { user } = useAuthContext();
  const { addDocument, response } = useFirestore("transactions");

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    addDocument({
      name: name,
      mobileNumber: number,
      work: work,
      amount: Number(amount),
      payment: payment,
      uid: user.uid,
    });
  };

  const handleClose = () => {
    navigate("/");
  };
  const { document, isPending, error } = useCollection("transactions", [
    "uid",
    "==",
    user.uid,
  ]);

  useEffect(() => {
    console.log(response);
    if (response.success == true) {
      setWork("");
      setAmount("");
      setPayment("");
      setName("");
      setNumber("");
      navigate("/");
    }
  }, [response.success]);

  return (
    <Slide direction="up">
      <div className={styles["form-container"]}>
        <button className={styles["closeButton"]} onClick={handleClose}>
          {" "}
          X{" "}
        </button>
        <form className={styles["customer-form"]} onSubmit={handleSubmit}>
          <h2>💁 new customer</h2>
          <label>
            <span>Work / Item Purchased</span>
            <input
              list="works"
              className={styles["input"]}
              type="text"
              placeholder="Work / Item Purchased"
              onChange={(e) => setWork(e.target.value)}
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
                placeholder="Customer Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </label>
            <label>
              <span>Mobile No.</span>
              <input
                className={styles["input"]}
                min="1000000000"
                max="9999999999"
                type="number"
                placeholder="Mobile No."
                onChange={(e) => setNumber(e.target.value)}
                value={number}
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
                type={"number"}
                min="1.00"
                placeholder="Amount"
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
                required
              />
            </label>
            <label>
              <span>Payment</span>
              <input
                className={styles["input"]}
                type="number"
                min="0.00"
                max={amount}
                placeholder="Payment"
                onChange={(e) => setPayment(e.target.value)}
                value={payment}
              />
            </label>
          </div>
          <button className={styles.btn}>Add</button>
        </form>
      </div>
    </Slide>
  );
}
