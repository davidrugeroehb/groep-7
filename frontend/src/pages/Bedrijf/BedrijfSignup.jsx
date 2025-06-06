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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/bedrijf/signup", {
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
        alert(data.message || "Registratie mislukt.");
      }
    } catch (error) {
      console.error(error);
      alert("Er ging iets mis bij registratie.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Bedrijf Registreren
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium">
              Bedrijfsnaam
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Adres</label>
            <input
              type="text"
              name="adres"
              value={formData.adres}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              BTW-nummer
            </label>
            <input
              type="text"
              name="btwNummer"
              value={formData.btwNummer}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Sector</label>
            <input
              type="text"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Contactpersoon
            </label>
            <input
              type="text"
              name="contactpersoon"
              value={formData.contactpersoon}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              E-mailadres
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Wachtwoord
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              GSM-nummer
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>

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
