
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Customer Pages
import Home from "./pages/Home";
import Sarees from "./pages/Sarees";
import Tops from "./pages/Tops";
import Kurtis from "./pages/Kurtis";
import Cart from "./pages/Cart";
import DesignerMaterials from "./pages/DesignerMaterials";
import Sale from "./pages/Sale";
import Wishlist from "./pages/Wishlist";

// Customer Auth
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Admin Auth & Pages
import AdminLogin from "./pages/AdminLogin";
import ProtectedAdmin from "./pages/admin/ProtectedAdmin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Settings from "./pages/admin/Settings";

// Layout Wrapper
function LayoutWrapper() {
  const location = useLocation();

  // Hide navbar & footer only inside admin panel (not admin-login)
  const isAdminPanel = location.pathname.startsWith("/admin") && location.pathname !== "/admin-login";

  return (
    <>
      {/* Navbar only for customer website */}
      {!isAdminPanel && <Navbar />}

      <Routes>
        {/* ================= CUSTOMER WEBSITE ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/sarees" element={<Sarees />} />
        <Route path="/tops" element={<Tops />} />
        <Route path="/kurtis" element={<Kurtis />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/designer" element={<DesignerMaterials />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* CUSTOMER LOGIN / SIGNUP */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Login */}
<Route path="/admin-login" element={<AdminLogin />} />

{/* Protected Admin Panel */}
<Route path="/admin" element={<ProtectedAdmin />}>
  <Route element={<AdminLayout />}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="products" element={<Products />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Route>

      {/* Footer only for customer website */}
      {!isAdminPanel && <Footer />}
    </>
  );
}

// Main App
export default function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper />
    </BrowserRouter>
  );
}                      