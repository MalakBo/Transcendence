import { useState } from "react";
import { apiRequest } from "../../../../services/api.js";


export function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    async function handleSubmit(event)
    {
        event.preventDefault();
        console.log("Form submitted ", email, password, role);
        await signup();
    }
    async function signup()
    {
      try
      {
        console.log("before fetch");
        const response = await apiRequest("/auth/register", {
          method: "POST",
          body: {
            name: name,
            email: email,
            password: password,
            role: role
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
            <label className="form-label">name</label>
            <input
              className="input"
              placeholder="your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

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
            <label className="form-label">role</label>
            <input
              className="input"
              type="text"
              placeholder="Enter your role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
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
            Sign up
          </button>
        </form>

        <div className="login-card-footer">
          already have an account? <a href="/register">login</a>
        </div>
      </div>
    </main>
  );
}
