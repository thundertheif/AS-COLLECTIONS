import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import Login from "./pages/login";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy login (replace with backend later)
    if (email && password) {
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      alert("Login Successful!");
      navigate("/");
    } else {
      alert("Enter Email & Password");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back 👗</h2>
        <p>Login to explore Sarees, Tops & Kurtis</p>

        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email Address" 
            onChange={(e) => setEmail(e.target.value)} 
          />

          <div className="password-box">
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="Password" 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <span onClick={() => setShowPass(!showPass)}>
              {showPass ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="remember-box">
            <input type="checkbox" /> Remember me
            <span className="forgot">Forgot Password?</span>
          </div>

          <button className="auth-btn">Login</button>
        </form>

        <div className="social-login">
          <button>Login with Google</button>
          <button>Login with Facebook</button>
        </div>

        <p>
          New User? <span onClick={() => navigate("/signup")}>Create Account</span>
        </p>
      </div>
    </div>
  );
}