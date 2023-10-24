import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Style/Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <NavLink
            className={({ isActive }) => (isActive ? styles.activeNavItem : "")}
            to="/home"
          >
            Home
          </NavLink>
        </li>{" "}
        <li className={styles.navItem}>
          <NavLink
            className={({ isActive }) => (isActive ? styles.activeNavItem : "")}
            to="/commented-posts"
          >
            Commented Posts
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink
            className={({ isActive }) => (isActive ? styles.activeNavItem : "")}
            to="/my-posts"
          >
            My Posts
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
