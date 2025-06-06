import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/team-placeholder.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Demo login voor student
    if (email === "student@demo.com" && password === "student123") {
      alert("Welkom student!");
      localStorage.setItem("role", "student");
      return navigate("/speeddates");
    }

    // ✅ Demo login voor admin
    if (email === "admin@ehb.be" && password === "admin123") {
      alert("Welkom admin!");
      localStorage.setItem("role", "admin");
      return navigate("/admin"); // Pas aan als route anders is
    }

    // ✅ Login voor bedrijf via backend
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
      console.error(err);
      alert("Serverfout bij login");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen flex flex-col items-center justify-center text-black bg-gray-50 px-4"
    >
      <h1 className="text-2xl font-bold mb-6">Welkom bij Career Match!</h1>

      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md flex flex-col items-center gap-5">
        {/* Logo */}
        <img src={logo} alt="EHB logo" className="h-20" />

        {/* Titel */}
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        {/* Email */}
        <div className="w-full">
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="jouw@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Wachtwoord */}
        <div className="w-full">
          <label htmlFor="password" className="block mb-1 font-medium">
            Wachtwoord
          </label>
          <input
            id="password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Sign-up knop voor bedrijven */}
        <div className="w-full text-center mt-4">
          <p className="mb-2">Nieuw bedrijf?</p>
          <button
            type="button"
            onClick={() => navigate('/bedrijf/signup')}
            className="bg-blue-500 text-white w-full py-2 rounded-md text-base hover:bg-blue-600 transition"
          >
            Sign-up
          </button>
        </div>

        {/* Login knop */}
        <button
          type="submit"
          className="bg-green-500 text-white w-full py-2 rounded-md text-base hover:bg-green-600 transition mt-4"
        >
          Login
        </button>
      </div>
    </form>
  );
}

export default Login;
