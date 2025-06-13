import React, { useState, useEffect, useCallback } from 'react'; // <-- ZEER BELANGRIJK: Zorg dat useState, useEffect en useCallback geïmporteerd zijn
import './Bedrijvenbeheer.css';

const API_BASE_URL = 'http://localhost:4000/api'; // JOUW API-URL - PAS AAN INDIEN NODIG

const Bedrijvenbeheer = () => {
    const [bedrijven, setBedrijven] = useState([]);
    const [aanvragen, setAanvragen] = useState([]);
    const [zoekTerm, setZoekTerm] = useState('');
    const [actieveTab, setActieveTab] = useState('geregistreerd');
    const [bewerkModal, setBewerkModal] = useState(null);

    // Hulpfunctie om API-requests te doen met authenticatie
    const authenticatedFetch = useCallback(async (url, options = {}) => {
        const token = localStorage.getItem('token');
        const headers = {
            ...options.headers,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Netwerk- of serverfout.' }));
            console.error(`API Fout (${url}):`, response.status, errorData);
            // Authenticatiefouten hier afhandelen (bv. redirect naar login)
            if (response.status === 401 || response.status === 403) {
                alert("Je sessie is verlopen of niet toegestaan. Gelieve opnieuw in te loggen.");
                // window.location.href = '/login'; // Of gebruik useNavigate voor React Router
            }
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }, []);

    // Functie om data te laden (bedrijven en aanvragen)
    const loadData = useCallback(async () => {
        try {
            // Voorlopig dient `initialBedrijven` als placeholder omdat we geen
            // `getAllBedrijven` route hebben op de backend voor het BedrijfModel.
            setBedrijven(initialBedrijven); // Houdt statische data voor geregistreerde bedrijven voorlopig

            // Pending aanvragen laden
            const pendingAanvragen = await authenticatedFetch(`${API_BASE_URL}/aanvragen/pending`);
            setAanvragen(pendingAanvragen);

        } catch (error) {
            console.error("Fout bij het laden van bedrijfsdata of aanvragen:", error);
            // Toon een foutmelding aan de gebruiker
        }
    }, [authenticatedFetch]);


    useEffect(() => {
        loadData();
    }, [loadData]);


    // Initiële state (fallback of demo als de API niet alles levert)
    const initialBedrijven = [ // Deze data wordt vervangen door de API als de route beschikbaar is
        {
            id: '654321abcd', // Voorbeeld van een echt ID
            naam: 'TechSolutions',
            sector: 'Web Development',
            taal: 'Nederlands',
            type: 'Stage',
            beschrijving: 'Stageplek voor front-end development met React. Wij zoeken een gemotiveerde stagiair die ons team komt versterken in het ontwikkelen van moderne webapplicaties.',
            status: 'actief'
        },
        {
            id: '654321abce', // Voorbeeld van een echt ID
            naam: 'AI Minds',
            sector: 'AI Machine Learning',
            taal: 'Engels',
            type: 'Studentjob',
            beschrijving: 'AI Minds ontwikkelt toepassingen met machine learning en data-analyse. Werkt aan innovatieve AI oplossingen.',
            status: 'actief'
        }
    ];

    const filterItems = (items) =>
        items.filter(item =>
            item.naam.toLowerCase().includes(zoekTerm.toLowerCase()) ||
            item.sector.toLowerCase().includes(zoekTerm.toLowerCase()) ||
            (item.studentNaam && item.studentNaam.toLowerCase().includes(zoekTerm.toLowerCase()))
        );

    // Aanvraag goedkeuren of weigeren
    const handleAanvraag = async (aanvraagId, accept = false) => {
        try {
            const status = accept ? 'goedgekeurd' : 'afgekeurd';
            await authenticatedFetch(`${API_BASE_URL}/aanvragen/${aanvraagId}`, {
                method: 'PATCH', // Of PUT, afhankelijk van je backend-implementatie
                body: JSON.stringify({ status: status })
            });
            alert(`Aanvraag ${accept ? 'goedgekeurd' : 'afgekeurd'}!`);
            loadData(); // Herlaad de data om de lijsten te updaten
        } catch (error) {
            console.error("Fout bij het verwerken van de aanvraag:", error);
            alert(`Fout bij het verwerken van de aanvraag: ${error.message}`);
        }
    };

    // Status van een geregistreerd bedrijf wijzigen
    const toggleStatus = async (id) => {
        alert("De functie om bedrijven te (de)activeren is nog niet geïmplementeerd in de backend (geen 'status' veld op Bedrijf Model).");
    };

    const saveEdit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedBedrijf = {
            id: bewerkModal.id,
            naam: formData.get('naam'),
            sector: formData.get('sector'),
            type: formData.get('type'), // Opmerking: 'type' zit niet in BedrijfModel, enkel voor demo
            taal: formData.get('taal'), // Opmerking: 'taal' zit niet in BedrijfModel, enkel voor demo
            beschrijving: formData.get('beschrijving') // Opmerking: 'beschrijving' zit niet in BedrijfModel
        };

        try {
            await authenticatedFetch(`${API_BASE_URL}/bedrijven/profiel/${updatedBedrijf.id}`, {
                method: 'PUT', // Of PATCH
                body: JSON.stringify({
                    name: updatedBedrijf.naam,
                    sector: updatedBedrijf.sector,
                })
            });
            alert('Bedrijf succesvol bijgewerkt!');
            setBewerkModal(null);
            loadData(); // Herlaad de data om de wijzigingen te tonen
        } catch (error) {
            console.error("Fout bij het opslaan van de bewerking:", error);
            alert(`Fout bij het opslaan: ${error.message}`);
        }
    };

    // Component rendering
    const renderBedrijfCard = (item, isAanvraag = false) => (
        <div key={item.id} className={`${isAanvraag ? 'aanvraag' : 'bedrijf'}-card`}>
            <div className="bedrijf-header">
                <h3>{item.naam}</h3>
                <span className="sector-tag">{item.sector}</span>
            </div>
            <div className="bedrijf-meta">
                {isAanvraag ? (
                    <>
                        <span>Student: {item.studentNaam} ({item.studentOpleiding})</span>
                        <span>Email: {item.studentEmail}</span>
                        <span>Talen student: {item.studentTalen}</span>
                    </>
                ) : (
                    <>
                        <span>{item.type}</span>
                        <span>{item.taal}</span>
                        <span>Status: {item.status}</span>
                    </>
                )}
            </div>
            <p>{item.beschrijving}</p>
            <div className={`${isAanvraag ? 'aanvraag' : 'bedrijf'}-acties`}>
                {isAanvraag ? (
                    <>
                        <button className="accepteer-btn" onClick={() => handleAanvraag(item.id, true)}>
                            <i className="fas fa-check-circle"></i> Goedkeuren
                        </button>
                        <button className="weiger-btn" onClick={() => handleAanvraag(item.id, false)}>
                            <i className="fas fa-times-circle"></i> Weigeren
                        </button>
                    </>
                ) : (
                    <>
                        <button className="bewerk-btn" onClick={() => setBewerkModal(item)}>
                            <i className="fas fa-edit"></i> Bewerken
                        </button>
                        <button
                            className={item.status === 'actief' ? 'deactiveer-btn' : 'activeer-btn'}
                            onClick={() => toggleStatus(item.id)}
                        >
                            {item.status === 'actief' ? (<><i className="fas fa-minus-circle"></i> Deactiveren</>) : (<><i className="fas fa-check-circle"></i> Activeren</>)}
                        </button>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className="bedrijvenbeheer-container">
            <h1>Bedrijvenbeheer</h1>

            <div className="zoekbalk">
                <input
                    type="text"
                    placeholder="Zoek bedrijf, sector of student..."
                    value={zoekTerm}
                    onChange={(e) => setZoekTerm(e.target.value)}
                />
            </div>

            <div className="tabbladen">
                <button
                    className={actieveTab === 'geregistreerd' ? 'actief' : ''}
                    onClick={() => setActieveTab('geregistreerd')}
                >
                    Geregistreerde bedrijven ({filterItems(initialBedrijven).length})
                </button>
                <button
                    className={actieveTab === 'aanvragen' ? 'actief' : ''}
                    onClick={() => setActieveTab('aanvragen')}
                >
                    Registratieaanvragen ({filterItems(aanvragen).length})
                </button>
            </div>

            {actieveTab === 'geregistreerd' && (
                <div className="bedrijven-lijst">
                    <h2>Beschikbare bedrijven ({filterItems(initialBedrijven).length})</h2>
                    {filterItems(initialBedrijven).map(bedrijf => renderBedrijfCard(bedrijf))}
                </div>
            )}

            {actieveTab === 'aanvragen' && (
                <div className="aanvragen-lijst">
                    <h2>Registratieaanvragen ({filterItems(aanvragen).length})</h2>
                    {filterItems(aanvragen).map(aanvraag => renderBedrijfCard(aanvraag, true))}
                    {filterItems(aanvragen).length === 0 && (
                        <p className="text-center text-gray-500 mt-5">Geen registratieaanvragen gevonden.</p>
                    )}
                </div>
            )}


            {bewerkModal && (
                <div className="modal">
                    <div className="modal-inhoud">
                        <h2>Bewerk {bewerkModal.naam}</h2>
                        <form onSubmit={saveEdit}>
                            {['naam', 'sector'].map(field => (
                                <div key={field} className="form-groep">
                                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                                    <input
                                        type="text"
                                        name={field}
                                        defaultValue={bewerkModal[field]}
                                        required
                                    />
                                </div>
                            ))}

                            <div className="form-groep">
                                <label>Type:</label>
                                <select name="type" defaultValue={bewerkModal.type}>
                                    {['Stage', 'Studentjob', 'Bachelorproef'].map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-groep">
                                <label>Taal:</label>
                                <select name="taal" defaultValue={bewerkModal.taal}>
                                    {['Nederlands', 'Engels', 'Frans'].map(taal => (
                                        <option key={taal} value={taal}>{taal}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-groep">
                                <label>Beschrijving:</label>
                                <textarea
                                    name="beschrijving"
                                    defaultValue={bewerkModal.beschrijving}
                                    required
                                />
                            </div>

                            <div className="modal-acties">
                                <button type="button" onClick={() => setBewerkModal(null)} className="annuleer-btn">
                                    Annuleren
                                </button>
                                <button type="submit" className="opslaan-btn">Opslaan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bedrijvenbeheer;