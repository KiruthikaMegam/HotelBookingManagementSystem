import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useHotel } from "../context/HotelContext";
import { initialAdmin } from "../data/hotelData";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginCustomer } = useHotel();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(
    location.pathname === "/admin/login"
  );
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  function handleCustomerLogin(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const result = loginCustomer(email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(location.state?.from || "/my-bookings", { replace: true });
  }

  function handleAdminLogin(e) {
    e.preventDefault();
    setAdminError("");

    if (!adminEmail.trim() || !adminPassword) {
      setAdminError("Please enter admin email and password.");
      return;
    }

    if (
      adminEmail.trim().toLowerCase() === initialAdmin.email.toLowerCase() &&
      adminPassword === initialAdmin.password
    ) {
      localStorage.setItem("rrAdminLoggedIn", "true");
      navigate("/admin", { replace: true });
      return;
    }

    setAdminError("Invalid admin email or password.");
  }

  function fillAdminCredentials() {
    setAdminEmail(initialAdmin.email);
    setAdminPassword(initialAdmin.password);
    setAdminError("");
  }

  return (
    <div className="customer-auth-page">
      <div className="customer-auth-image">
        <div className="customer-auth-image-content">
          <span>WELCOME TO RR RESORT</span>
          <h1>Experience Luxury. Create Memories.</h1>
          <p>
            Discover beautiful stays, relaxing experiences and
            unforgettable moments with us.
          </p>
        </div>
      </div>

      <div className="customer-auth-form-area">
        <div className="customer-auth-form">
          <Link to="/" className="customer-auth-logo">
            RR <span>RESORT</span>
          </Link>

          <span className="customer-auth-subtitle">WELCOME BACK</span>
          <h2>Customer Sign In</h2>
          <p className="customer-auth-description">
            Login to manage your reservations.
          </p>

          {error && <div className="customer-auth-error">{error}</div>}

          <form onSubmit={handleCustomerLogin}>
            <div className="customer-auth-input-group">
              <label htmlFor="customer-email">Email Address</label>
              <input
                id="customer-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="customer-auth-input-group">
              <label htmlFor="customer-password">Password</label>
              <div className="customer-password-field">
                <input
                  id="customer-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="customer-auth-submit">
              Sign In
            </button>
          </form>

          <p className="customer-auth-switch">
            Don't have an account? <Link to="/register">Create Account</Link>
          </p>

          <div className="unified-login-divider">
            <span>OR</span>
          </div>

          <div className="admin-login-entry">
            <div>
              <strong>Resort administrator?</strong>
              <p>Sign in to manage rooms and reservations.</p>
            </div>
            <button
              type="button"
              className="admin-login-toggle"
              onClick={() => {
                setShowAdminLogin(!showAdminLogin);
                setAdminError("");
              }}
            >
              {showAdminLogin ? "Hide Admin Login" : "Admin Login"}
              <span>{showAdminLogin ? "−" : "+"}</span>
            </button>
          </div>

          {showAdminLogin && (
            <form className="unified-admin-form" onSubmit={handleAdminLogin}>
              <h3>Admin Login</h3>
              <p>Enter your administrator credentials to open the dashboard.</p>

              {adminError && <div className="customer-auth-error">{adminError}</div>}

              <div className="customer-auth-input-group">
                <label htmlFor="admin-email">Admin Email Address</label>
                <input
                  id="admin-email"
                  type="email"
                  placeholder="Enter admin email"
                  value={adminEmail}
                  onChange={(e) => {
                    setAdminEmail(e.target.value);
                    setAdminError("");
                  }}
                />
              </div>

              <div className="customer-auth-input-group">
                <label htmlFor="admin-password">Admin Password</label>
                <div className="customer-password-field">
                  <input
                    id="admin-password"
                    type={showAdminPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setAdminError("");
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                  >
                    {showAdminPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="admin-demo-credentials">
                <span>DEMO ADMIN CREDENTIALS</span>
                <p><strong>Email:</strong> {initialAdmin.email}</p>
                <p><strong>Password:</strong> {initialAdmin.password}</p>
                <button type="button" onClick={fillAdminCredentials}>
                  Use Demo Credentials
                </button>
              </div>

              <button type="submit" className="customer-auth-submit">
                Login to Admin Dashboard
              </button>
            </form>
          )}

          <Link to="/" className="customer-auth-back">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
