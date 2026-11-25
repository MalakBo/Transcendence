import { useState } from "react";
import { apiRequest } from "../../../../services/api.js";
import { useNavigate } from "react-router-dom";
import {validateForm, validationRules} from "../../services/ValidateAuth.js";
import { useAuth } from "../../../../context/AuthContext.jsx";


export function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [role, setRole] = useState("");
    const [ApiError, setApiError] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { setUser } = useAuth();

    async function handleSubmit(event)
    {
        event.preventDefault();
        const values = {name, email, password,retypePassword, role};
        const validationErrors = validateForm(values, validationRules);

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0)
          return;
        await signup();
        console.log("Form submitted ", email, role);
    }

    function redirectByRole(userRole) {
      if (userRole === "PROVIDER")
          navigate("/events");
      if (userRole === "ORGANIZER")
          navigate("/services");
      replace: true;
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
        const userRole = response.data.user.role;
        setUser(response.data.user);
        redirectByRole(userRole);
      }catch(error)
      {
        setApiError("*" + error.message);
        return;
      }
    }
  return (
    <main>
        <div className="login-card">
        <div className="login-card-header">
          <h1 className="login-card-title">
            Welcome
          </h1>
          <p className="login-card-description">
            Enter your credentials to create an account.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="input"
              placeholder="your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          {errors.name && <p className="error-message">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
       
          <div className="form-group">
            <label className="form-label" disabled>Select your role</label>
            <select className="input" value={role}
              onChange={(event) => setRole(event.target.value)} name="role" id="role-select">
              <option className="input" value="" disabled>Select your role</option>
              <option className="input" value="PROVIDER">Provider</option>
              <option className="input" value="ORGANIZER">Organiser</option>
            </select>
          {errors.role && <p className="error-message">{errors.role}</p>}
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
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Retype password</label>
            <input
              className="input"
              type="password"
              placeholder="Enter your password"
              value={retypePassword}
              onChange={(event) => setRetypePassword(event.target.value)}
            />
            {errors.retypePassword &&
          <p className="error-message">{errors.retypePassword}</p>}
          </div>

          {ApiError && <p className="error-message">{ApiError}</p>}
          <button type="submit" className="btn btn-primary full-width">
              Sign up
          </button>
        </form>

        <div className="login-card-footer">
          already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </main>
  );
}
