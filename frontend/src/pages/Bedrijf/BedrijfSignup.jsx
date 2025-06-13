import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function BedrijfSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    adres: "",
    btwNummer: "",
    website: "",
    sector: "",
    contactpersoon: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && !/^\d*$/.test(value)) return; // Alleen cijfers voor GSM

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/bedrijf/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registratie gelukt! Je wordt doorgestuurd naar login.");
        setFormData({
          name: "",
          adres: "",
          btwNummer: "",
          website: "",
          sector: "",
          contactpersoon: "",
          email: "",
          password: "",
          phone: "",
        });
        navigate("/login");
      } else {
        setError(data.message || "Registratie mislukt.");
      }
    } catch (error) {
      console.error(error);
      setError("Er ging iets mis bij registratie.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Bedrijf Registreren
        </h1>

        {error && (
          <p className="text-red-600 text-center mb-6 font-semibold">{error}</p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          {[
            { label: "Bedrijfsnaam", name: "name", required: true },
            { label: "Adres", name: "adres" },
            { label: "BTW-nummer", name: "btwNummer" },
            { label: "Website", name: "website" },
            { label: "Sector", name: "sector" },
            { label: "Contactpersoon", name: "contactpersoon", required: true },
            { label: "E-mailadres", name: "email", type: "email", required: true },
            { label: "Wachtwoord", name: "password", type: "password", required: true },
            { label: "GSM-nummer", name: "phone", required: true },
          ].map(({ label, name, type = "text", required }) => (
            <div key={name}>
              <label className="block text-gray-700 font-medium">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={required}
                className="w-full p-2 mt-1 border border-gray-300 rounded"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Registreer
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Al een account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            Log hier in
          </button>
        </p>
      </div>
    </main>
  );
}

export default BedrijfSignup;
