import React, { useState, useEffect, useCallback } from 'react'; // Zorg dat deze imports correct zijn
import './Bedrijvenbeheer.css';

const API_BASE_URL = 'http://localhost:4000/api'; // JOUW API-URL - PAS AAN INDIEN NODIG

const Bedrijvenbeheer = () => {
    const [bedrijven, setBedrijven] = useState([]); // Deze wordt nu dynamisch geladen
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
            if (response.status === 401 || response.status === 403) {
                alert("Je sessie is verlopen of niet toegestaan. Gelieve opnieuw in te loggen.");
                // Overweeg hier een useNavigate om de gebruiker naar de loginpagina te sturen
            }
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }, []);

    // Functie om data te laden (bedrijven en aanvragen)
    const loadData = useCallback(async () => {
        try {
            // Laad geregistreerde bedrijven vanuit de database
            const loadedBedrijven = await authenticatedFetch(`${API_BASE_URL}/bedrijven`); // Gebruik de nieuwe route
            setBedrijven(loadedBedrijven.map(b => ({
                id: b._id, // MongoDB _id als 'id' gebruiken
                naam: b.name,
                sector: b.sector,
                // Taal en Type zijn niet in BedrijfModel, dus simuleren of toevoegen indien nodig
                taal: 'N/B', // Aanpassen als je taal toevoegt aan BedrijfModel
                type: 'N/B', // Aanpassen als je type toevoegt aan BedrijfModel
                beschrijving: b.beschrijving || 'Geen beschrijving beschikbaar.', // Voeg beschrijving toe aan BedrijfModel indien van toepassing
                status: b.status || 'actief' // Voeg status toe aan BedrijfModel indien van toepassing
            })));


            // Pending aanvragen laden
            const pendingAanvragen = await authenticatedFetch(`${API_BASE_URL}/aanvragen/pending`);
            setAanvragen(pendingAanvragen);

        } catch (error) {
            console.error("Fout bij het laden van bedrijfsdata of aanvragen:", error);
            // Toon een foutmelding aan de gebruiker
            alert(`Fout bij het laden van data: ${error.message}`);
        }
    }, [authenticatedFetch]);


    useEffect(() => {
        loadData();
    }, [loadData]);


    // filterItems functie heeft nu toegang tot de dynamische data
    const filterItems = (items) =>
        items.filter(item =>
            item.naam.toLowerCase().includes(zoekTerm.toLowerCase()) ||
            item.sector.toLowerCase().includes(zoekTerm.toLowerCase()) ||
            (item.studentNaam && item.studentNaam.toLowerCase().includes(zoekTerm.toLowerCase())) // Voor aanvragen
        );

    // Aanvraag goedkeuren of weigeren (bestaand)
    const handleAanvraag = async (aanvraagId, accept = false) => {
        try {
            const status = accept ? 'goedgekeurd' : 'afgekeurd';
            await authenticatedFetch(`${API_BASE_URL}/aanvragen/${aanvraagId}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: status })
            });
            alert(`Aanvraag ${accept ? 'goedgekeurd' : 'afgekeurd'}!`);
            loadData(); // Herlaad de data om de lijsten te updaten
        } catch (error) {
            console.error("Fout bij het verwerken van de aanvraag:", error);
            alert(`Fout bij het verwerken van de aanvraag: ${error.message}`);
        }
    };

    // Status van een geregistreerd bedrijf wijzigen (nog steeds alert, zie commentaar)
    const toggleStatus = async (id) => {
        alert("De functie om bedrijven te (de)activeren is nog niet geïmplementeerd in de backend (geen 'status' veld op Bedrijf Model).");
        // Indien je dit wel implementeert:
        // const currentBedrijf = bedrijven.find(b => b.id === id);
        // const newStatus = currentBedrijf.status === 'actief' ? 'inactief' : 'actief';
        // await authenticatedFetch(`${API_BASE_URL}/bedrijven/${id}/status`, { // Voorbeeldroute
        //     method: 'PATCH',
        //     body: JSON.stringify({ status: newStatus })
        // });
        // loadData();
    };

    const saveEdit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedBedrijfData = { // Data die naar de backend gaat
            name: formData.get('naam'), // Komt overeen met `name` in BedrijfModel
            sector: formData.get('sector'), // Komt overeen met `sector` in BedrijfModel
            // Voeg hier ook andere BedrijfModel velden toe die je wilt bijwerken
            // bijv. adres: formData.get('adres'), website: formData.get('website'), etc.
        };

        try {
            await authenticatedFetch(`${API_BASE_URL}/bedrijven/profiel/${bewerkModal.id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedBedrijfData)
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
                        {/* 'Type' en 'Taal' zijn momenteel niet in BedrijfModel, dus deze zijn placeholder */}
                        <span>{item.type || 'N/B'}</span>
                        <span>{item.taal || 'N/B'}</span>
                        <span>Status: {item.status || 'N/B'}</span>
                    </>
                )}
            </div>
            <p>{item.beschrijving}</p> {/* Beschrijving is ook niet in BedrijfModel */}
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
                    Geregistreerde bedrijven ({filterItems(bedrijven).length})
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
                    <h2>Beschikbare bedrijven ({filterItems(bedrijven).length})</h2>
                    {filterItems(bedrijven).length > 0 ? (
                        filterItems(bedrijven).map(bedrijf => renderBedrijfCard(bedrijf))
                    ) : (
                        <p className="text-center text-gray-500 mt-5">Geen geregistreerde bedrijven gevonden.</p>
                    )}
                </div>
            )}

            {actieveTab === 'aanvragen' && (
                <div className="aanvragen-lijst">
                    <h2>Registratieaanvragen ({filterItems(aanvragen).length})</h2>
                    {filterItems(aanvragen).length > 0 ? (
                        filterItems(aanvragen).map(aanvraag => renderBedrijfCard(aanvraag, true))
                    ) : (
                        <p className="text-center text-gray-500 mt-5">Geen registratieaanvragen gevonden.</p>
                    )}
                </div>
            )}


            {bewerkModal && (
                <div className="modal">
                    <div className="modal-inhoud">
                        <h2>Bewerk {bewerkModal.naam}</h2>
                        <form onSubmit={saveEdit}>
                            {/* 'naam' komt overeen met 'name' in BedrijfModel */}
                            <div className="form-groep">
                                <label>Naam:</label>
                                <input
                                    type="text"
                                    name="naam"
                                    defaultValue={bewerkModal.naam}
                                    required
                                />
                            </div>
                            {/* 'sector' komt overeen met 'sector' in BedrijfModel */}
                            <div className="form-groep">
                                <label>Sector:</label>
                                <input
                                    type="text"
                                    name="sector"
                                    defaultValue={bewerkModal.sector}
                                    required
                                />
                            </div>
                            {/* De volgende velden (Type, Taal, Beschrijving) bestaan NIET in uw BedrijfModel.
                                  Ze zijn opgenomen in de initialBedrijven array voor demo doeleinden.
                                  Als u deze in de DB wilt opslaan, moet u het BedrijfModel uitbreiden. */}
                            <div className="form-groep">
                                <label>Type:</label>
                                <select name="type" defaultValue={bewerkModal.type}>
                                    {['Stage', 'Studentjob', 'Bachelorproef', 'N/B'].map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-groep">
                                <label>Talen:</label>
                                <select name="taal" defaultValue={bewerkModal.taal}>
                                    {['Nederlands', 'Engels', 'Frans', 'N/B'].map(taal => (
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