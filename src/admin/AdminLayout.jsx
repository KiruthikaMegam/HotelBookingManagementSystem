import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("rrAdminLoggedIn");
    navigate("/admin/login");
  }

  const menuItems = [
  { name: "Dashboard", path: "/admin", icon: "▦" },
  { name: "Manage Rooms", path: "/admin/rooms", icon: "▣" },
  { name: "Manage Bookings", path: "/admin/bookings", icon: "▤" },
  { name: "Settings", path: "/admin/settings", icon: "⚙" }
];

  return (
    <div className="admin-layout">
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="admin-sidebar-logo">
          <div className="admin-logo-icon">RR</div>
          <div>
            <h2>RR RESORT</h2>
            <span>ADMIN PANEL</span>
          </div>
          <button
            className="admin-close-menu"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="admin-menu-heading">MAIN MENU</div>

        <nav className="admin-navigation">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                isActive ? "admin-nav-link active" : "admin-nav-link"
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-profile-card">
            <div className="admin-profile-avatar">A</div>
            <div>
              <h4>Resort Admin</h4>
              <span>Administrator</span>
            </div>
          </div>

          <button className="admin-sidebar-logout" onClick={handleLogout}>
            <span>↗</span> Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu-button"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <div className="admin-topbar-title">
            <h2>RR Resort Management</h2>
            <p>Manage your resort activities</p>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-topbar-date">
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              })}
            </div>

            <div className="admin-topbar-avatar">A</div>
          </div>
        </header>

        <main className="admin-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}