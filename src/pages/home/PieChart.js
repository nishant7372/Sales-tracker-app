import styles from "./PieChart.module.css";
import { useEffect, useState } from "react";
export default function PieChart({ totalAmount, totalPayment }) {
  const paid = (totalPayment / totalAmount) * 100;
  const pending = ((totalAmount - totalPayment) / totalAmount) * 100;

  const [a, setA] = useState(`${paid.toFixed(1)} %`);
  const [b, setB] = useState(`${pending.toFixed(1)} %`);

  useEffect(() => {
    if (Number.isFinite(paid)) setA(`${paid.toFixed(1)} %`);
    if (Number.isFinite(pending)) setB(`${pending.toFixed(1)} %`);
  }, [paid, pending]);

  return (
    <div className={styles["chart-container"]}>
      {Number.isFinite(paid) && (
        <div className={styles["flex-col"]}>
          <div
            className={`${styles[`pie`]} ${styles[`animate`]}`}
            style={{ ["--p"]: paid, ["--c"]: `rgb(2,157,2)` }}
            onMouseEnter={() =>
              setA(
                `₹ ${
                  String(totalPayment).length > 7
                    ? String(totalPayment).slice(0, 7) + "..."
                    : totalPayment
                }`
              )
            }
            onMouseLeave={() => setA(`${paid.toFixed(1)} %`)}
          >
            {a}
          </div>
          <div>Payment Recieved</div>
        </div>
      )}
      {Number.isFinite(pending) && (
        <div className={styles["flex-col"]}>
          <div
            className={`${styles[`pie`]} ${styles[`animate`]}`}
            style={{ ["--p"]: pending, ["--c"]: "#FF2400" }}
            onMouseEnter={() =>
              setB(
                `₹ ${
                  String(totalAmount - totalPayment).length > 7
                    ? String(totalAmount - totalPayment).slice(0, 7) + "..."
                    : totalAmount - totalPayment
                }`
              )
            }
            onMouseLeave={() => setB(`${pending.toFixed(1)} %`)}
          >
            {b}
          </div>
          <div>Payment Pending</div>
        </div>
      )}
    </div>
  );
}
