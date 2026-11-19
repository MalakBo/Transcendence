import { apiRequest } from "../../../../services/api.js";
import { useState } from "react";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    async function handleSubmit(event)
    {
        event.preventDefault();
        console.log("Form submitted ", email, password);
        await login();
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
      }catch(error)
      {
        console.error("Fetch error: ", error);
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
