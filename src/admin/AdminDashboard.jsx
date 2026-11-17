
import { Link } from "react-router-dom";
import { useHotel } from "../context/HotelContext";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { rooms, bookings } = useHotel();

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed"
  );

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  );

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled"
  );

  let totalRevenue = 0;

  for (const booking of confirmedBookings) {
    totalRevenue += Number(booking.totalPrice || 0);
  }

  const availableRooms = rooms.filter(
    (room) => room.available === true
  );

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  function handleLogout() {
    localStorage.removeItem("rrAdminLoggedIn");
    window.location.href = "/admin/login";
  }

  return (
    <main className="admin-dashboard page-animation">
      <div className="admin-container">

        {/* Dashboard Heading */}
        <div className="admin-heading">
          <div>
            <span>RR RESORT MANAGEMENT</span>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's your resort overview.</p>
          </div>

          <div className="admin-heading-actions">
            <div className="admin-date">
              <span>Today</span>
              <strong>
                {new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}
              </strong>
            </div>

            <button
              className="admin-logout-btn"
              onClick={handleLogout}
            >
              <span>↗</span> Logout
            </button>
          </div>
        </div>

        {/* Statistics */}
        <section className="admin-stat-grid">

          <div className="admin-stat-card">
            <div className="admin-stat-icon teal-icon">▣</div>
            <div>
              <p>Total Rooms</p>
              <h2>{rooms.length}</h2>
              <span>Registered rooms</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon green-icon">✓</div>
            <div>
              <p>Available Rooms</p>
              <h2>{availableRooms.length}</h2>
              <span>Currently listed as available</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon blue-icon">▤</div>
            <div>
              <p>Total Bookings</p>
              <h2>{bookings.length}</h2>
              <span>All reservations</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon orange-icon">◷</div>
            <div>
              <p>Pending Bookings</p>
              <h2>{pendingBookings.length}</h2>
              <span>Waiting for confirmation</span>
            </div>
          </div>

        </section>

        {/* Revenue and Room Overview */}
        <section className="admin-overview-grid">

          <div className="admin-panel revenue-panel">
            <div className="admin-panel-heading">
              <div>
                <span>FINANCIAL OVERVIEW</span>
                <h2>Total Revenue</h2>
              </div>

              <div className="revenue-icon">₹</div>
            </div>

            <h1>
              ₹{totalRevenue.toLocaleString("en-IN")}
            </h1>

            <p>Revenue from confirmed bookings</p>

            <div className="revenue-details">
              <div>
                <span>Confirmed</span>
                <strong>{confirmedBookings.length}</strong>
              </div>

              <div>
                <span>Pending</span>
                <strong>{pendingBookings.length}</strong>
              </div>

              <div>
                <span>Cancelled</span>
                <strong>{cancelledBookings.length}</strong>
              </div>
            </div>
          </div>

          <div className="admin-panel room-overview">
            <div className="admin-panel-heading">
              <div>
                <span>ROOM STATUS</span>
                <h2>Room Overview</h2>
              </div>

              <Link to="/admin/rooms">Manage</Link>
            </div>

            <div className="room-progress-info">
              <span>Available Rooms</span>

              <strong>
                {rooms.length > 0
                  ? Math.round((availableRooms.length / rooms.length) * 100)
                  : 0}%
              </strong>
            </div>

            <div className="room-progress">
              <div
                style={{
                  width: `${
                    rooms.length > 0
                      ? (availableRooms.length / rooms.length) * 100
                      : 0
                  }%`
                }}
              ></div>
            </div>

            <div className="room-status-row">
              <span>
                <i className="available-dot"></i>
                Available
              </span>
              <strong>{availableRooms.length}</strong>
            </div>

            <div className="room-status-row">
              <span>
                <i className="unavailable-dot"></i>
                Unavailable
              </span>
              <strong>{rooms.length - availableRooms.length}</strong>
            </div>
          </div>

        </section>

        {/* Recent Bookings */}
        <section className="admin-panel recent-bookings-panel">
          <div className="admin-panel-heading">
            <div>
              <span>RESERVATION ACTIVITY</span>
              <h2>Recent Bookings</h2>
            </div>

            <Link to="/admin/bookings">View All</Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="admin-empty-state">
              <div>▤</div>
              <h3>No bookings yet</h3>
              <p>New customer reservations will appear here.</p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentBookings.map((booking) => {
                    const room = rooms.find(
                      (item) =>
                        String(item.id) === String(booking.roomId)
                    );

                    return (
                      <tr key={booking.id}>
                        <td>
                          <strong>#{booking.id}</strong>
                        </td>

                        <td>
                          {booking.guestName ||
                            booking.guest?.name ||
                            "Guest"}
                        </td>

                        <td>{room ? room.name : "Room"}</td>

                        <td>{booking.checkIn}</td>

                        <td>{booking.checkOut}</td>

                        <td>
                          ₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}
                        </td>

                        <td>
                          <span
                            className={`admin-status ${
                              (booking.status || "Pending").toLowerCase()
                            }`}
                          >
                            {booking.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="admin-quick-actions">
          <h2>Quick Actions</h2>

          <div className="quick-action-grid">

            <Link to="/admin/rooms">
              <span>＋</span>

              <div>
                <h3>Manage Rooms</h3>
                <p>Add or update resort rooms</p>
              </div>

              <b>→</b>
            </Link>

            <Link to="/admin/bookings">
              <span>▤</span>

              <div>
                <h3>Manage Bookings</h3>
                <p>View and update reservations</p>
              </div>

              <b>→</b>
            </Link>

          </div>
        </section>

      </div>
    </main>
  );
}
