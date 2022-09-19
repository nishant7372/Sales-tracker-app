import Styles from "./Confirm.module.css";

export default function Confirm({ id, deleteDoc }) {
  return (
    <div className={Styles["overlay"]}>
      <div className={Styles["confirm-message"]}>
        <div>This item will be deleted Permanently. &nbsp;Are you Sure?</div>
        <div className={Styles.buttonContainer}>
          <button className={Styles.yes} onClick={() => deleteDoc(true, id)}>
            yes
          </button>
          <button className={Styles.no} onClick={() => deleteDoc(false, id)}>
            no
          </button>
        </div>
      </div>
    </div>
  );
}
