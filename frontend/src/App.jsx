import { useEffect, useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Intervention from "./components/Intervention";
import { api } from "./api";

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [student, setStudent] = useState(null);

  async function loadStudent() {
    const token = localStorage.getItem("token");

    if (!token) {
      setScreen("login");
      return;
    }

    try {
      const data = await api.getMe();
      setStudent(data);
      setScreen("dashboard");
    } catch {
      localStorage.removeItem("token");
      setStudent(null);
      setScreen("login");
    }
  }

  useEffect(() => {
    loadStudent();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setStudent(null);
    setScreen("login");
  }

  async function refreshStudent() {
    const data = await api.getMe();
    setStudent(data);
    return data;
  }

  if (screen === "loading") {
    return (
      <div className="loading-page">
        <div className="spinner" />
        <h2>Loading research portal...</h2>
      </div>
    );
  }

  if (screen === "login") {
    return (
      <Login
        onLogin={async () => {
          await loadStudent();
        }}
        onSignup={() => setScreen("signup")}
      />
    );
  }

  if (screen === "signup") {
    return (
      <Signup
        onSignupSuccess={() => setScreen("login")}
        onLogin={() => setScreen("login")}
      />
    );
  }

  if (screen === "intervention") {
    return (
      <Intervention
        student={student}
        onComplete={async () => {
          await refreshStudent();
          setScreen("dashboard");
        }}
        onBack={() => setScreen("dashboard")}
      />
    );
  }

  return (
    <Dashboard
      student={student}
      onRefresh={refreshStudent}
      onIntervention={() => setScreen("intervention")}
      onLogout={handleLogout}
    />
  );
}
