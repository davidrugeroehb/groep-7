import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/fotoehb.png"; // Make sure this path is correct for your logo

function Login() {
  const navigate = useNavigate();

  // Use a single state for email and password, consistent with new backend approach
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData; // Destructure for easier use

    // ✅ Hardcoded Admin login check (kept from your original code)
    if (email === "admin@ehb.be" && password === "admin123") {
      alert("Welkom admin!");
      localStorage.setItem("role", "admin");
      localStorage.setItem("userId", "admin_id_placeholder"); // Placeholder for admin ID
      return navigate("/admin");
    }

    // ✅ Attempt unified login via the new backend endpoint
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Send email and password
      });

      const data = await res.json(); // Parse the response JSON

      if (res.ok) {
        alert(data.message); // E.g., "Student succesvol ingelogd!" or "Bedrijf succesvol ingelogd!"

        // Store detected role and userId in localStorage
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.userId); // Universal ID for student or company

        // Store role-specific IDs for backward compatibility if needed, or if other parts of app rely on them
        if (data.role === "student") {
          localStorage.setItem("studentId", data.userId);
          // localStorage.setItem("studentToken", data.token); // If your student-specific components still use this
          navigate("/speeddates");
        } else if (data.role === "bedrijf") {
          localStorage.setItem("bedrijfId", data.userId);
          // localStorage.setItem("bedrijfToken", data.token); // If your company-specific components still use this
          navigate("/bedrijf-home");
        }else if (data.role === "admin") {
          localStorage.setItem("adminId", data.userId);
          // localStorage.setItem("bedrijfToken", data.token); // If your company-specific components still use this
          navigate("/admin-home");
        } else {
          // Fallback for unexpected roles from backend
          console.warn("Onbekende rol ontvangen na login:", data.role);
          navigate("/"); // Default redirect
        }
      } else {
        // If response is NOT ok (e.g., 400, 401, 404 from authController.js)
        alert(data.message || "Login mislukt. Controleer uw gegevens.");
        console.error("Login API error:", data.message);
      }
    } catch (err) {
      // Network errors or other unexpected issues
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
              name="email" // Added name attribute
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
              name="password" // Added name attribute
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
