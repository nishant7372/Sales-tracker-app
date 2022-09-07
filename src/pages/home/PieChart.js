import styles from "./PieChart.module.css";

export default function PieChart({ totalAmount, totalPayment }) {
  const paid = (totalPayment / totalAmount) * 100;
  const pending = ((totalAmount - totalPayment) / totalAmount) * 100;
  return (
    <div className={styles["chart-container"]}>
      <div className={styles["flex-col"]}>
        <div
          className={`${styles[`pie`]} ${styles[`animate`]}`}
          style={{ ["--p"]: paid, ["--c"]: `rgb(2,157,2)` }}
        >
          {" "}
          {paid.toFixed(1)} %
        </div>
        <div>Payment Recieved</div>
      </div>
      <div className={styles["flex-col"]}>
        <div
          className={`${styles[`pie`]} ${styles[`animate`]}`}
          style={{ ["--p"]: pending, ["--c"]: "#FF2400" }}
        >
          {" "}
          {pending.toFixed(1)} %
        </div>
        <div>Payment Pending</div>
      </div>
    </div>
  );
}
