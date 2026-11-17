
import { Routes, Route } from "react-router-dom";

import { HotelProvider } from "./context/HotelContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedCustomerRoute from "./components/ProtectedCustomerRoute";

import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import Booking from "./pages/Booking";
import Confirmation from "./pages/Confirmation";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";

import AdminDashboard from "./admin/AdminDashboard";
import ManageRooms from "./admin/ManageRooms";
import ManageBookings from "./admin/ManageBookings";
import AdminLogin from "./admin/AdminLogin";
import ProtectedAdminRoute from "./admin/ProtectedAdminRoute";
import AdminLayout from "./admin/AdminLayout";
import AdminSettings from "./admin/AdminSettings";

import "./App.css";

function App() {
  return (
    <HotelProvider>
      <div className="app">
        <Routes>

          {/* Customer Public Pages */}

          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            }
          />

          <Route
            path="/rooms"
            element={
              <>
                <Navbar />
                <Rooms />
                <Footer />
              </>
            }
          />

          <Route
            path="/rooms/:id"
            element={
              <>
                <Navbar />
                <RoomDetails />
                <Footer />
              </>
            }
          />

          <Route
            path="/booking/:id"
            element={
              <>
                <Navbar />
                <Booking />
                <Footer />
              </>
            }
          />

          <Route
            path="/confirmation"
            element={
              <>
                <Navbar />
                <Confirmation />
                <Footer />
              </>
            }
          />

          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <Login />
                <Footer />
              </>
            }
          />

          <Route
            path="/register"
            element={
              <>
                <Navbar />
                <Register />
                <Footer />
              </>
            }
          />

          {/* My Bookings - Public Route */}
          {/* MyBookings itself checks customer login status */}

          <Route
            path="/my-bookings"
            element={
              <>
                <Navbar />
                <MyBookings />
                <Footer />
              </>
            }
          />

          {/* Other Customer Protected Pages */}

          <Route element={<ProtectedCustomerRoute />}>
            <Route
              path="/profile"
              element={
                <>
                  <Navbar />
                  <Profile />
                  <Footer />
                </>
              }
            />
          </Route>

          {/* About and Contact */}

          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <About />
                <Footer />
              </>
            }
          />

          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <Contact />
                <Footer />
              </>
            }
          />

          {/* Admin Login */}

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          {/* Admin Protected Pages */}

          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />

              <Route
                path="rooms"
                element={<ManageRooms />}
              />

              <Route
                path="bookings"
                element={<ManageBookings />}
              />

              <Route
                path="settings"
                element={<AdminSettings />}
              />
            </Route>
          </Route>

        </Routes>
      </div>
    </HotelProvider>
  );
}

export default App;
