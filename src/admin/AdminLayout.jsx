import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Navbar isAdmin />
      <main className="admin-page-content">
        <Outlet />
      </main>
    </div>
  );
}
