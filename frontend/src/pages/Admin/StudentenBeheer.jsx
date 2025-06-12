import React, { useEffect, useState } from "react";


function StudentenBeheer() { // AANPASSING: Functienaam
  const [studenten, setStudenten] = useState([]);
  const [error, setError] = useState(null);
  const verwijderStudent=async(id)=>{
    try{
    setStudenten(studenten.filter((student)=>student._id!==id));
    }catch(err){
      console.error('Verwijderen mislukt', err)
    }
  }

  useEffect(() => {
    const fetchStudenten = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/studenten", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bedrijfToken")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Fout bij ophalen van studenten.");
        }

        const data = await res.json();
        setStudenten(data);
      } catch (err) {
        console.error(err);
        setError("Kan studenten niet ophalen.");
      }
    };

    fetchStudenten();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Studenten beheren {/* AANPASSING: Titel */}
        </h1>

        {error && (
          <p className="text-center text-red-600 font-medium mb-6">{error}</p>
        )}

        {studenten.length === 0 && !error ? (
          <p className="text-center text-gray-500">Er zijn momenteel geen studenten beschikbaar.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {studenten.map((s) => (
              <div
                key={s._id}
                className="bg-gray-100 rounded-xl p-6 shadow border border-gray-300"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  {s.voornaam} {s.achternaam}
                </h2>
                <p className="text-gray-700">
                  <strong>Email:</strong> {s.email}
                </p>
                <p className="text-gray-700">
                  <strong>Opleiding:</strong> {s.opleiding}
                </p>
                <p className="text-gray-700">
                  <strong>Specialisatie:</strong> {s.specialisatie || "—"}
                </p>
                <p className="text-gray-700">
                  <strong>Talen:</strong> {s.talen || "—"}
                </p>
                <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={()=>verwijderStudent(s._id)}>Verwijder</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


export default StudentenBeheer;
