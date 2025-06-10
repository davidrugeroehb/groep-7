import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/fotoehb.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Admin login (hardcoded)
    if (email === "admin@ehb.be" && password === "admin123") {
      alert("Welkom admin!");
      localStorage.setItem("role", "admin");
      return navigate("/admin");
    }

    // ✅ Probeer student login
    try {
      const res = await fetch("http://localhost:4000/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("studentToken", data.token);
        localStorage.setItem("role", "student");
        alert(`Welkom student, ${data.name}!`);
        return navigate("/speeddates");
      }
    } catch (err) {
      console.warn("Student login mislukt:", err.message);
    }

    // ✅ Probeer bedrijf login
    try {
      const res = await fetch("http://localhost:4000/api/bedrijf/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("bedrijfToken", data.token);
        localStorage.setItem("role", "bedrijf");
        alert(`Welkom, ${data.name}!`);
        return navigate("/bedrijf-home");
      } else {
        alert(data.message || "Login mislukt");
      }
    } catch (err) {
      console.error("Bedrijf login error:", err);
      alert("Er ging iets mis bij login.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <img src={logo} alt="Logo" className="mx-auto mb-6 h-16" />
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
          Login
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Wachtwoord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Nog geen bedrijfsaccount?{" "}
          <button
            onClick={() => navigate("/bedrijf/signup")}
            className="text-blue-600 hover:underline"
          >
            Registreer hier
          </button>
        </p>
      </div>
    </main>
  );
}

export default Login;
