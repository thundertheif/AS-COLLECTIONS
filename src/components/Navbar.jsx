import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/images/ASC.jpg";
import Login from "./pages/Login";

export default function Navbar() {
  const loggedIn = localStorage.getItem("loggedIn");

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    window.location.reload();
  };

  return (
    <header className="nav-main">
      <div className="nav-top">
        <Link to="/" className="logo-container">
          <img src={logo} alt="AS COLLECTIONS" className="logo-img" />
          <span className="logo-text">AS COLLECTIONS</span>
        </Link>

        <div className="search-box">
          <input type="text" placeholder="Search sarees, kurtis, tops..." />
          <button>🔍</button>
        </div>

        <div className="nav-icons">
          <Link to="/wishlist">❤️ Wishlist</Link>
          <Link to="/cart">🛒 Cart</Link>

          {!loggedIn ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </div>
      </div>

      <nav className="nav-menu">
        <Link to="/sarees">Sarees</Link>
        <Link to="/tops">Tops</Link>
        <Link to="/kurtis">Kurtis</Link>
        <Link to="/designer">Designer</Link>
        <Link to="/sale">SALE</Link>
      </nav>
    </header>
  );

}

