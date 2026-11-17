
import { useState } from "react";
import { Link } from "react-router-dom";
import { useHotel } from "../context/HotelContext";
import "./ManageBookings.css";

export default function ManageBookings() {
  const { bookings, rooms, updateBookingStatus, updatePaymentStatus } = useHotel();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [message, setMessage] = useState("");

  const filteredBookings = bookings.filter((booking) => {
    const room = rooms.find((item) => item.id === Number(booking.roomId));

    const guestName = booking.guestName || booking.guest?.name || "";
    const roomName = room ? room.name : "";

    const matchesSearch =
      guestName.toLowerCase().includes(search.toLowerCase()) ||
      booking.email?.toLowerCase().includes(search.toLowerCase()) ||
      String(booking.id).toLowerCase().includes(search.toLowerCase()) ||
      roomName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function handleStatusChange(id, status) {
    updateBookingStatus(id, status);
    setMessage("Booking status updated successfully.");
    setSelectedBooking(null);
  }

  function handlePaymentChange(id, status) {
    updatePaymentStatus(id, status);
    setMessage("Payment status updated successfully.");
    setSelectedBooking(null);
  }

  function getRoomName(roomId) {
    const room = rooms.find((item) => item.id === Number(roomId));
    return room ? room.name : "Room not found";
  }

  function getStatusClass(status) {
    if (status === "Confirmed") return "booking-confirmed";
    if (status === "Cancelled") return "booking-cancelled";
    return "booking-pending";
  }

  let totalRevenue = 0;
  let pendingCount = 0;
  let confirmedCount = 0;
  let cancelledCount = 0;

  for (const booking of bookings) {
    if (booking.status === "Confirmed") {
      confirmedCount++;
      totalRevenue += Number(booking.totalPrice || 0);
    }

    if (booking.status === "Pending") pendingCount++;
    if (booking.status === "Cancelled") cancelledCount++;
  }

  return (
    <div className="manage-bookings-page">

      <div className="manage-bookings-heading">
        <div>
          <span className="admin-eyebrow">RESERVATION MANAGEMENT</span>
          <h1>Manage Bookings</h1>
          <p>View and manage all customer reservations.</p>
        </div>

        <Link to="/admin" className="booking-back-btn">
          ← Dashboard
        </Link>
      </div>

      {message && (
        <div className="booking-success-message">
          {message}
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}

      <div className="booking-stat-grid">

        <div className="booking-stat-card">
          <span>Total Bookings</span>
          <h2>{bookings.length}</h2>
          <small>All reservations</small>
        </div>

        <div className="booking-stat-card">
          <span>Confirmed</span>
          <h2>{confirmedCount}</h2>
          <small>Confirmed reservations</small>
        </div>

        <div className="booking-stat-card">
          <span>Pending</span>
          <h2>{pendingCount}</h2>
          <small>Waiting for approval</small>
        </div>

        <div className="booking-stat-card">
          <span>Total Revenue</span>
          <h2>₹{totalRevenue.toLocaleString("en-IN")}</h2>
          <small>{cancelledCount} cancelled bookings</small>
        </div>

      </div>

      <div className="booking-table-card">

        <div className="booking-table-heading">
          <div>
            <h2>Reservation List</h2>
            <p>Search and manage customer bookings.</p>
          </div>

          <span className="booking-count">
            {filteredBookings.length} Bookings
          </span>
        </div>

        <div className="booking-filters">

          <div className="booking-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search guest, room or booking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

        </div>

        {filteredBookings.length === 0 ? (
          <div className="booking-empty">
            <div>▤</div>
            <h3>No Bookings Found</h3>
            <p>There are no reservations matching your search.</p>
          </div>
        ) : (
          <div className="booking-table-wrapper">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Check In / Out</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <strong>#{booking.id}</strong>
                    </td>

                    <td>
                      <div className="booking-guest">
                        <div className="booking-avatar">
                          {(booking.guestName || booking.guest?.name || "G")
                            .charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {booking.guestName || booking.guest?.name || "Guest"}
                          </strong>
                          <small>
                            {booking.email || booking.guest?.email || "No email"}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>{getRoomName(booking.roomId)}</td>

                    <td>
                      <div className="booking-dates">
                        <span>{booking.checkIn}</span>
                        <small>to {booking.checkOut}</small>
                      </div>
                    </td>

                    <td>
                      <strong>
                        ₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}
                      </strong>
                    </td>

                    <td>
                      <span className={`booking-status ${getStatusClass(booking.status)}`}>
                        {booking.status || "Pending"}
                      </span>
                    </td>

                    <td>
                      <span className={`payment-status ${booking.paymentStatus === "Paid" ? "payment-paid" : "payment-unpaid"}`}>
                        {booking.paymentStatus || "Unpaid"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="booking-view-btn"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {selectedBooking && (
        <div className="booking-modal-overlay">
          <div className="booking-details-modal">

            <button
              className="booking-modal-close"
              onClick={() => setSelectedBooking(null)}
            >
              ×
            </button>

            <span className="admin-eyebrow">RESERVATION DETAILS</span>
            <h2>Booking #{selectedBooking.id}</h2>

            <div className="booking-detail-list">
              <p>
                <span>Guest Name</span>
                <strong>
                  {selectedBooking.guestName || selectedBooking.guest?.name || "Guest"}
                </strong>
              </p>

              <p>
                <span>Email</span>
                <strong>
                  {selectedBooking.email || selectedBooking.guest?.email || "-"}
                </strong>
              </p>

              <p>
                <span>Phone</span>
                <strong>
                  {selectedBooking.phone || selectedBooking.guest?.phone || "-"}
                </strong>
              </p>

              <p>
                <span>Room</span>
                <strong>{getRoomName(selectedBooking.roomId)}</strong>
              </p>

              <p>
                <span>Check In</span>
                <strong>{selectedBooking.checkIn}</strong>
              </p>

              <p>
                <span>Check Out</span>
                <strong>{selectedBooking.checkOut}</strong>
              </p>

              <p>
                <span>Total Amount</span>
                <strong>
                  ₹{Number(selectedBooking.totalPrice || 0).toLocaleString("en-IN")}
                </strong>
              </p>

              <p>
                <span>Booking Status</span>
                <strong>{selectedBooking.status || "Pending"}</strong>
              </p>

              <p>
                <span>Payment Status</span>
                <strong>{selectedBooking.paymentStatus || "Unpaid"}</strong>
              </p>
            </div>

            <div className="booking-modal-actions">

              {selectedBooking.status !== "Confirmed" &&
                selectedBooking.status !== "Cancelled" && (
                  <button
                    className="booking-confirm-action"
                    onClick={() =>
                      handleStatusChange(selectedBooking.id, "Confirmed")
                    }
                  >
                    Confirm Booking
                  </button>
                )}

              {selectedBooking.status !== "Cancelled" && (
                <button
                  className="booking-cancel-action"
                  onClick={() =>
                    handleStatusChange(selectedBooking.id, "Cancelled")
                  }
                >
                  Cancel Booking
                </button>
              )}

              {selectedBooking.paymentStatus !== "Paid" && (
                <button
                  className="booking-payment-action"
                  onClick={() =>
                    handlePaymentChange(selectedBooking.id, "Paid")
                  }
                >
                  Mark as Paid
                </button>
              )}

              <button
                className="booking-close-action"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
