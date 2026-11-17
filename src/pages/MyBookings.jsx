
import { useState } from "react";
import { Link } from "react-router-dom";
import { useHotel } from "../context/HotelContext";
import "./MyBookings.css";

export default function MyBookings() {
  const {
    bookings,
    customer,
    currentCustomerId,
    cancelBooking,
    logoutCustomer
  } = useHotel();

  const [activeFilter, setActiveFilter] = useState("All");
  const [cancelId, setCancelId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const isLoggedIn =
    localStorage.getItem("rrCustomerLoggedIn") === "true" &&
    Boolean(currentCustomerId) &&
    Boolean(customer?.email);

  // Get only the current customer's bookings.
  const customerBookings = bookings.filter((booking) => {
    if (booking.customerId) {
      return (
        String(booking.customerId) === String(currentCustomerId)
      );
    }

    // Support older bookings created before customerId was added.
    const bookingEmail =
      booking.email || booking.guest?.email || "";

    return (
      bookingEmail.toLowerCase() ===
      customer.email.toLowerCase()
    );
  });

  const filteredBookings = customerBookings.filter((booking) => {
    if (activeFilter === "All") {
      return true;
    }

    return booking.status === activeFilter;
  });

  const sortedBookings = [...filteredBookings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const confirmedCount = customerBookings.filter(
    (item) => item.status === "Confirmed"
  ).length;

  const cancelledCount = customerBookings.filter(
    (item) => item.status === "Cancelled"
  ).length;

  const totalBookingValue = customerBookings
    .filter((item) => item.status !== "Cancelled")
    .reduce(
      (total, item) => total + Number(item.totalPrice || 0),
      0
    );

  function formatDate(date) {
    if (!date) {
      return "-";
    }

    return new Date(date + "T00:00:00").toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  }

  function openCancelModal(id) {
    setCancelId(id);
    setShowCancelModal(true);
    setSuccessMessage("");
  }

  function closeCancelModal() {
    setCancelId(null);
    setShowCancelModal(false);
  }

  function handleCancelBooking() {
    if (!cancelId) {
      return;
    }

    const result = cancelBooking(cancelId);

    if (result) {
      setSuccessMessage(
        "Your booking has been cancelled successfully."
      );
    }

    closeCancelModal();
  }

  // Show Sign In message when customer is not logged in.
  if (!isLoggedIn) {
    return (
      <main className="my-bookings-page page-animation">
        <div className="my-bookings-container">
          <div className="my-bookings-empty">
            <div className="empty-booking-icon">🔒</div>

            <h2>Sign In to View Your Bookings</h2>

            <p>
              Please sign in to your RR Resort account to view
              your booking history and manage your reservations.
            </p>

            <Link to="/login" className="primary-btn">
              Sign In
            </Link>

            <p style={{ marginTop: "15px" }}>
              Don't have an account?{" "}
              <Link to="/register">
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="my-bookings-page page-animation">
      <div className="my-bookings-container">

        <div className="my-bookings-heading">
          <div>
            <span>YOUR RR RESORT JOURNEY</span>
            <h1>My Bookings</h1>
            <p>
              Manage your reservations and plan your next getaway.
            </p>
          </div>

          <Link to="/rooms" className="primary-btn">
            + Book a Room
          </Link>
        </div>

        <div className="booking-stat-grid">

          <div className="booking-stat-card">
            <span className="booking-stat-icon">📋</span>
            <div>
              <strong>{customerBookings.length}</strong>
              <small>Total Bookings</small>
            </div>
          </div>

          <div className="booking-stat-card">
            <span className="booking-stat-icon">✓</span>
            <div>
              <strong>{confirmedCount}</strong>
              <small>Confirmed</small>
            </div>
          </div>

          <div className="booking-stat-card">
            <span className="booking-stat-icon">✕</span>
            <div>
              <strong>{cancelledCount}</strong>
              <small>Cancelled</small>
            </div>
          </div>

          <div className="booking-stat-card">
            <span className="booking-stat-icon">₹</span>
            <div>
              <strong>
                ₹{totalBookingValue.toLocaleString("en-IN")}
              </strong>
              <small>Total Booking Value</small>
            </div>
          </div>

        </div>

        <div className="my-bookings-toolbar">
          <div>
            <h2>Reservation History</h2>
            <p>
              {sortedBookings.length} reservations found
            </p>
          </div>

          <div className="booking-filter-tabs">
            {["All", "Confirmed", "Cancelled"].map((filter) => (
              <button
                key={filter}
                className={
                  activeFilter === filter ? "active" : ""
                }
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {successMessage && (
          <div className="booking-success-message">
            <span>✓</span>
            {successMessage}

            <button
              onClick={() => setSuccessMessage("")}
            >
              ×
            </button>
          </div>
        )}

        {sortedBookings.length > 0 ? (
          <div className="my-bookings-list">

            {sortedBookings.map((booking) => (
              <div
                className="my-booking-card"
                key={booking.id}
              >
                <div className="my-booking-image">
                  <img
                    src={booking.roomImage}
                    alt={booking.roomName}
                  />
                </div>

                <div className="my-booking-content">

                  <div className="my-booking-top">
                    <div>
                      <span className="my-booking-type">
                        {booking.roomType}
                      </span>

                      <h3>{booking.roomName}</h3>

                      <p className="my-booking-id">
                        Booking ID: {booking.id}
                      </p>
                    </div>

                    <span
                      className={`booking-status-badge ${
                        booking.status.toLowerCase()
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="my-booking-info-grid">

                    <div>
                      <span>CHECK-IN</span>
                      <strong>
                        {formatDate(booking.checkIn)}
                      </strong>
                    </div>

                    <div>
                      <span>CHECK-OUT</span>
                      <strong>
                        {formatDate(booking.checkOut)}
                      </strong>
                    </div>

                    <div>
                      <span>GUESTS</span>
                      <strong>
                        {booking.guests} Guests
                      </strong>
                    </div>

                    <div>
                      <span>DURATION</span>
                      <strong>
                        {booking.nights} Nights
                      </strong>
                    </div>

                  </div>

                  <div className="my-booking-extra-grid">
                    <div>
                      <span>GUEST NAME</span>
                      <strong>{booking.guestName || booking.guest?.name || customer.name}</strong>
                    </div>
                    <div>
                      <span>CONTACT</span>
                      <strong>{booking.phone || booking.guest?.phone || customer.phone || "-"}</strong>
                    </div>
                    <div>
                      <span>PRICE / NIGHT</span>
                      <strong>₹{Number(booking.pricePerNight || 0).toLocaleString("en-IN")}</strong>
                    </div>
                    <div>
                      <span>ROOM AMOUNT</span>
                      <strong>₹{Number(booking.roomTotal || booking.totalPrice || 0).toLocaleString("en-IN")}</strong>
                    </div>
                    <div>
                      <span>SERVICE FEE</span>
                      <strong>₹{Number(booking.serviceFee || 0).toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="booking-extra-wide">
                      <span>EMAIL ADDRESS</span>
                      <strong>{booking.email || booking.guest?.email || "-"}</strong>
                    </div>
                    <div className="booking-extra-wide">
                      <span>GUEST ADDRESS</span>
                      <strong>{booking.address || booking.guest?.address || "-"}</strong>
                    </div>
                    {booking.requests && (
                      <div className="booking-extra-wide">
                        <span>SPECIAL REQUESTS</span>
                        <strong>{booking.requests}</strong>
                      </div>
                    )}
                  </div>

                  <div className="my-booking-bottom">

                    <div>
                      <span>Total Amount</span>

                      <strong>
                        ₹{Number(
                          booking.totalPrice || 0
                        ).toLocaleString("en-IN")}
                      </strong>

                      <small>
                        Payment: {booking.paymentStatus || "Pending"}
                      </small>
                    </div>

                    {booking.status !== "Cancelled" && (
                      <button
                        className="cancel-booking-btn"
                        onClick={() =>
                          openCancelModal(booking.id)
                        }
                      >
                        Cancel Booking
                      </button>
                    )}

                  </div>

                </div>
              </div>
            ))}

          </div>
        ) : (
          <div className="my-bookings-empty">
            <div className="empty-booking-icon">▤</div>

            <h2>
              {customerBookings.length === 0
                ? "No Bookings Yet"
                : "No Reservations Found"}
            </h2>

            <p>
              {customerBookings.length === 0
                ? "You haven't made any reservations yet. Explore our rooms and plan your stay."
                : "There are no bookings under this status."}
            </p>

            <Link to="/rooms" className="primary-btn">
              Explore Rooms
            </Link>
          </div>
        )}

      </div>

      {showCancelModal && (
        <div className="cancel-modal-overlay">
          <div className="cancel-modal">

            <div className="cancel-modal-icon">!</div>

            <h2>Cancel Reservation?</h2>

            <p>
              Are you sure you want to cancel this booking?
              This action cannot be undone.
            </p>

            <div className="cancel-modal-actions">

              <button
                className="cancel-modal-back"
                onClick={closeCancelModal}
              >
                Keep Booking
              </button>

              <button
                className="cancel-modal-confirm"
                onClick={handleCancelBooking}
              >
                Yes, Cancel
              </button>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}
