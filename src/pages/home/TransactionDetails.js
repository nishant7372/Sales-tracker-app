import styles from "./TransactionDetails.module.css";

export default function TransactionDetails({ doc }) {
  const calcStatus = (amount, payment) => {
    if (amount > payment) {
      return "Pending";
    } else {
      return "Success";
    }
  };

  const date = new Date(doc.createdAt);
  const locale = navigator.locale;

  const options = {
    hour: "numeric",
    minute: "numeric",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const transactionTime = new Intl.DateTimeFormat(locale, options).format(date);

  return (
    <div className={styles["description-box"]}>
      <div>
        <span>Amount: </span> ₹ {doc.amount}
      </div>
      {doc.name && (
        <div>
          <span>Customer Name: </span> {doc.name}
        </div>
      )}
      {doc.mobileNumber > 0 && (
        <div>
          <span>Mobile No: </span> +91 {doc.mobileNumber}
        </div>
      )}
      <div>
        <span>Status: </span> {calcStatus(doc.amount, doc.payment)}
      </div>
      {doc.amount > doc.payment && (
        <div>
          <span>Pending Amount: </span> ₹ {doc.amount - doc.payment}
        </div>
      )}
      <div>
        <em>{transactionTime}</em>
      </div>
    </div>
  );
}
