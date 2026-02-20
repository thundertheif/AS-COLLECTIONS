import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (name && email && password) {
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);
      alert("Signup Successful!");
      navigate("/login");
    } else {
      alert("Fill all fields");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Your Fashion Account 👑</h2>
        <p>Join AS Collections for exclusive sarees & kurtis</p>

        <form onSubmit={handleSignup}>
          <input 
            placeholder="Full Name" 
            onChange={(e) => setName(e.target.value)} 
          />

          <input 
            type="email" 
            placeholder="Email Address" 
            onChange={(e) => setEmail(e.target.value)} 
          />

          <input 
            type="password" 
            placeholder="Create Password" 
            onChange={(e) => setPassword(e.target.value)} 
          />

          <button className="auth-btn">Sign Up</button>
        </form>

        <div className="social-login">
          <button>Signup with Google</button>
          <button>Signup with Facebook</button>
        </div>

        <p>
          Already have account? <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}