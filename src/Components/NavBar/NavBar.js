import styles from "./NavBar.module.css";
import "./NavBar.css";
import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function NavBar() {
  const navColors = ["green"];
  const [index, setIndex] = useState(0);

  const { logout } = useLogout();
  const { user } = useAuthContext();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        return prevIndex == navColors.length - 1 ? 0 : prevIndex + 1;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const parseUserName = (name) => {
    if (name.indexOf(" ") != -1) return name.substring(0, name.indexOf(" "));
    else return name;
  };

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
