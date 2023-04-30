import styles from "./NavBar.module.css";
import { NavLink, Link } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function NavBar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const getFirstLetters = (name) => {
    const arr = name.split(" ");
    let s = "";
    for (const x of arr) {
      s += x[0];
    }
    return s;
  };

  return (
    <div className={`${styles["nav-container"]} ${styles["sticky"]}`}>
      <div className={styles["navbar"]}>
        <div className={styles["nav-left"]}>
          <Link to="/" className={styles["app-name"]}>
            Sales Tracker
          </Link>
        </div>

        {!user && (
          <div className={styles["nav-right-noauth"]}>
            <div className={styles["github"]}>
              <a
                className="fa-brands fa-github"
                href="https://github.com/nishant7372/tvmaze"
              >
                {""}
              </a>
            </div>
            <NavLink to="/login" className={styles["log-btn"]}>
              LogIn
            </NavLink>
            <NavLink to="/signup" className={styles["log-btn"]}>
              SignUp
            </NavLink>
          </div>
        )}

        {user && (
          <div className={styles["nav-right-auth"]}>
            <div className={styles["github"]}>
              <a
                title="github"
                className="fa-brands fa-github"
                href="https://github.com/nishant7372/sales-tracker-app"
              >
                {""}
              </a>
            </div>
            <div title={user.displayName} className={styles["userNameLogo"]}>
              {getFirstLetters(user.displayName)}
            </div>
            <div className={styles["log-btn"]} onClick={logout}>
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
