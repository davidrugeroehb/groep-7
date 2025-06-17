import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/fotoehb.png"; // Zorg ervoor dat dit pad klopt voor je logo

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verwijder de hardcoded Admin login check hier
    // if (email === "admin@ehb.be" && password === "admin123") {
    //   alert("Welkom admin!");
    //   localStorage.setItem("role", "admin");
    //   localStorage.setItem("userId", "admin_id_placeholder");
    //   return navigate("/admin");
    // }

    // Probeer login via de universele backend endpoint
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);

        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.userId);

        if (data.role === "student") {
          localStorage.setItem("studentId", data.userId);
          navigate("/basis");
        } else if (data.role === "bedrijf") {
          localStorage.setItem("bedrijfId", data.userId);
          navigate("/basis");
        } else if (data.role === "admin") { // Deze zal nu correct worden uitgevoerd
          localStorage.setItem("adminId", data.userId);
          navigate("/admin-home"); // Stuurt naar de admin homepagina
        } else {
          console.warn("Onbekende rol ontvangen na login:", data.role);
          navigate("/");
        }
      } else {
        alert(data.message || "Login mislukt. Controleer uw gegevens.");
        console.error("Login API error:", data.message);
      }
    } catch (err) {
      console.error("Fout bij login fetch request:", err);
      alert(`Er ging iets mis bij het inloggen: ${err.message || "Controleer uw internetverbinding."}`);
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Wachtwoord</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
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
