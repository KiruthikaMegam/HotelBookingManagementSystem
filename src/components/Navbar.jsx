import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useHotel } from "../context/HotelContext";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { currentCustomerId, logoutCustomer } = useHotel();

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    logoutCustomer();
    closeMenu();
    navigate("/login", { replace: true });
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="logo-icon">RR</div>
          <div className="logo-text">
            <h2>RR RESORT</h2>
            <span>RELAX · RECHARGE · RECONNECT</span>
          </div>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/rooms" onClick={closeMenu}>Rooms</NavLink>
          <NavLink to="/my-bookings" onClick={closeMenu}>My Bookings</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>

          {currentCustomerId ? (
            <>
              <NavLink to="/profile" onClick={closeMenu}>Profile</NavLink>
              <button
                type="button"
                className="navbar-login navbar-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar-login" onClick={closeMenu}>
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
