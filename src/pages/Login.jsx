
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useHotel } from "../context/HotelContext";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { loginCustomer } = useHotel();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleLogin(e) {
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

    navigate(location.state?.from || "/my-bookings", {
      replace: true
    });
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
        <form
          className="customer-auth-form"
          onSubmit={handleLogin}
        >
          <Link to="/" className="customer-auth-logo">
            RR <span>RESORT</span>
          </Link>

          <span className="customer-auth-subtitle">
            WELCOME BACK
          </span>

          <h2>Sign In</h2>

          <p className="customer-auth-description">
            Login to manage your reservations.
          </p>

          {error && (
            <div className="customer-auth-error">
              {error}
            </div>
          )}

          <div className="customer-auth-input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="customer-auth-input-group">
            <label>Password</label>

            <div className="customer-password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="customer-auth-submit"
          >
            Sign In
          </button>

          <p className="customer-auth-switch">
            Don't have an account?{" "}
            <Link to="/register">Create Account</Link>
          </p>

          <Link to="/" className="customer-auth-back">
            ← Back to Home
          </Link>
        </form>
      </div>
    </div>
  );
}
