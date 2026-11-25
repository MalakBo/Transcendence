import { apiRequest } from "../../../../services/api.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUser } = useAuth();
    
    async function handleSubmit(event)
    {
        event.preventDefault();
        if (!email || !password)
        {
          setError("*Please fill in all fields");
          return;
        }
        await login();
        console.log("Form submitted ", email);
    }
    async function login()
    {
      try
      {
        console.log("before fetch");
        const response = await apiRequest("/auth/login", {
          method: "POST",
          body:{
            email: email,
            password: password
          }
        });

        console.log(response);
        setUser(response.data.user);
        const role = response.data.user.role;

        if (role == "PROVIDER")
        {
          navigate("/events");
        }
        else
        {
          navigate("/services");
        }
      }catch(error)
      {
        setError("*"+error.message);
        return;
      }
    }
  return (
    <main>
    <div className="login-card">
      <div className="login-card-header">
        <h1 className="login-card-title">
          Welcome back
        </h1>
        <p className="login-card-description">
          Enter your credentials to continue.
        </p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="input"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn btn-primary full-width">
          Login
        </button>
      </form>

      <div className="login-card-footer">
        Don't have an account? <a href="/signup">Register</a>
      </div>
    </div>
    </main>
  );
}
