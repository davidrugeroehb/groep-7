import React, { useEffect, useState } from 'react';

function Bedrijvenbeheer() {
  const [speeddates, setSpeeddates] = useState([]);
  const [aanvragenCount, setAanvragenCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('bedrijfToken');

        const [speeddateRes, aanvragenRes] = await Promise.all([
          fetch('http://localhost:4000/api/bedrijf/speeddates', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:4000/api/bedrijf/aanvragen/count', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!speeddateRes.ok || !aanvragenRes.ok) {
          throw new Error('Fout bij ophalen van data.');
        }

        const speeddatesData = await speeddateRes.json();
        const aanvragenData = await aanvragenRes.json();

        setSpeeddates(speeddatesData);
        setAanvragenCount(aanvragenData.count);
      } catch (err) {
        console.error(err);
        setError('Kan speeddates of aanvragen niet ophalen.');
      }
    };

    fetchData();
  }, []);

  return (
  <p>

  </p>
  );
}

export default Bedrijvenbeheer;
