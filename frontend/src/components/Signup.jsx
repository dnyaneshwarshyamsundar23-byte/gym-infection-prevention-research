import { useState } from "react";
import { api } from "../api";

export default function Signup({ onSignupSuccess, onLogin }) {
  const [form, setForm] = useState({
    participant_id: "",
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.signup(form);
      setSuccess("Account created successfully. Please log in.");
      setTimeout(onSignupSuccess, 900);
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
          <div className="badge">RESEARCH PARTICIPANT</div>
          <h1>
            Create Your
            <br />
            Account
          </h1>
          <p>Your research journey starts here.</p>
        </div>
      </section>

      <section className="auth-container">
        <div className="auth-card">
          <div className="shield">🛡️</div>
          <h2>Participant Registration</h2>
          <p className="muted">
            Use the participant details provided for your study.
          </p>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="participant">Participant ID</label>
            <input
              id="participant"
              required
              value={form.participant_id}
              onChange={(event) =>
                updateField("participant_id", event.target.value)
              }
              placeholder="Example: P001"
            />

            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Enter your name"
            />

            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="Enter your email"
            />

            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={form.password}
              onChange={(event) =>
                updateField("password", event.target.value)
              }
              placeholder="Minimum 8 characters"
            />

            <button className="primary-button full" disabled={loading}>
              {loading ? "Creating..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <div className="switch-auth">
            Already registered?{" "}
            <button className="link-button" onClick={onLogin}>
              Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
