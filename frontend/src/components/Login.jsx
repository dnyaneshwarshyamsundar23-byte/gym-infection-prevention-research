import { useState } from "react";
import { api } from "../api";

export default function Login({ onLogin, onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api.login({ email, password });
      localStorage.setItem("token", data.access_token);
      await onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div className="visual-content">
          <div className="badge">ACADEMIC RESEARCH</div>
          <h1>
            Gym Infection
            <br />
            Prevention
          </h1>
          <p>Learn • Practise • Protect</p>
        </div>
      </section>

      <section className="auth-container">
        <div className="auth-card">
          <div className="shield">🛡️</div>
          <h2>Participant Login</h2>
          <p className="muted">
            Sign in to continue your research activities.
          </p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />

            <button className="primary-button full" disabled={loading}>
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          <div className="switch-auth">
            New participant?{" "}
            <button className="link-button" onClick={onSignup}>
              Create Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
