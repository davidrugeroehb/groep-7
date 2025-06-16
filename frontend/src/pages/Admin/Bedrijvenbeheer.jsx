import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom'; // Importeer useLocation
import './Bedrijvenbeheer.css';

const API_BASE_URL = 'http://localhost:4000/api';

const Bedrijvenbeheer = () => {
    const [geregistreerdeBedrijven, setGeregistreerdeBedrijven] = useState([]); // Nieuwe naam voor duidelijkheid
    const [registratieAanvragen, setRegistratieAanvragen] = useState([]); // Nieuwe naam voor duidelijkheid
    const [zoekTerm, setZoekTerm] = useState('');
    const [actieveTab, setActieveTab] = useState('geregistreerd');
    const [bewerkModal, setBewerkModal] = useState(null);

    const location = useLocation(); // Haal de huidige URL locatie op

    // Effect om de actieve tab in te stellen op basis van URL query parameter
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tab = queryParams.get('tab');
        if (tab === 'aanvragen') {
            setActieveTab('aanvragen');
        } else {
            setActieveTab('geregistreerd'); // Standaard
        }
    }, [location.search]); // Herlaad wanneer de URL verandert


    // Hulpfunctie om API-requests te doen met authenticatie
    const authenticatedFetch = useCallback(async (url, options = {}) => {
        const token = localStorage.getItem('token');
        const headers = {
            ...options.headers,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        try {
            const response = await fetch(url, { ...options, headers });
            if (!response.ok) {
                let errorData = { message: 'Onbekende fout' };
                try {
                    errorData = await response.json();
                } catch (jsonErr) {
                    console.warn(`Geen JSON response bij fout ${response.status} van ${url}`);
                    errorData.message = `Netwerk- of serverfout: Status ${response.status}.`;
                }
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return response.json();
        } catch (err) {
            console.error("Fout in authenticatedFetch:", err);
            throw err;
        }
    }, []);

    // Functie om data te laden
    const loadData = useCallback(async () => {
        try {
            // Laad ALLE goedgekeurde bedrijven (status 'approved')
            const loadedGeregistreerdeBedrijven = await authenticatedFetch(`${API_BASE_URL}/bedrijven`); // Deze route geeft nu 'approved' bedrijven
            setGeregistreerdeBedrijven(loadedGeregistreerdeBedrijven.map(b => ({
                id: b._id,
                naam: b.name,
                sector: b.sector,
                adres: b.adres, // Voeg relevante velden toe uit BedrijfModel
                website: b.website,
                contactpersoon: b.contactpersoon,
                email: b.email,
                phone: b.phone,
                status: b.status, // Dit zal 'approved' zijn
                // 'type' en 'taal' zijn niet in BedrijfModel, indien nodig uitbreiden
                type: 'N/B',
                taal: 'N/B',
                beschrijving: 'Geen beschrijving beschikbaar.' // Voeg beschrijving toe aan BedrijfModel indien van toepassing
            })));


            // Laad ALLE afwachtende bedrijfsregistraties (status 'pending')
            const loadedRegistratieAanvragen = await authenticatedFetch(`${API_BASE_URL}/bedrijven/pending-registrations`);
            setRegistratieAanvragen(loadedRegistratieAanvragen.map(b => ({
                id: b._id,
                naam: b.name,
                sector: b.sector,
                adres: b.adres,
                website: b.website,
                contactpersoon: b.contactpersoon,
                email: b.email,
                phone: b.phone,
                status: b.status, // Dit zal 'pending' zijn
                // Hier kunnen we ook studentNaam, studentOpleiding etc weglaten, want dit zijn bedrijfsaanvragen, geen speeddate aanvragen
            })));


        } catch (error) {
            console.error("Fout bij het laden van bedrijfsdata of registratieaanvragen:", error);
            alert(`Fout bij het laden van data: ${error.message}`);
        }
    }, [authenticatedFetch]);


    useEffect(() => {
        loadData();
    }, [loadData]);


    // filterItems functie past zich aan de data aan
    const filterItems = (items) =>
        items.filter(item =>
            item.naam.toLowerCase().includes(zoekTerm.toLowerCase()) ||
            item.sector.toLowerCase().includes(zoekTerm.toLowerCase()) ||
            (item.contactpersoon && item.contactpersoon.toLowerCase().includes(zoekTerm.toLowerCase())) ||
            (item.email && item.email.toLowerCase().includes(zoekTerm.toLowerCase()))
        );

    // Bedrijfsregistratie aanvraag goedkeuren of afwijzen
    const handleRegistratieAanvraag = async (bedrijfId, accept = false) => {
        try {
            const url = accept
                ? `${API_BASE_URL}/bedrijven/approve-registration/${bedrijfId}`
                : `${API_BASE_URL}/bedrijven/reject-registration/${bedrijfId}`;
            
            await authenticatedFetch(url, { method: 'PATCH' });

            alert(`Bedrijfsregistratie ${accept ? 'goedgekeurd' : 'afgewezen'}!`);
            loadData(); // Herlaad de data om de lijsten te updaten
        } catch (error) {
            console.error("Fout bij het verwerken van de bedrijfsregistratieaanvraag:", error);
            alert(`Fout bij het verwerken van de aanvraag: ${error.message}`);
        }
    };

    // Status van een geregistreerd bedrijf wijzigen (deze functie is nog niet operationeel zonder backend support)
    const toggleStatus = async (id) => {
        alert("De functie om bedrijven te (de)activeren is nog niet volledig geïmplementeerd in de backend (vereist een specifieke route voor statuswijziging).");
    };

    const saveEdit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedBedrijfData = {
            name: formData.get('naam'),
            sector: formData.get('sector'),
            // Voeg hier ook andere BedrijfModel velden toe die je wilt bijwerken
            adres: formData.get('adres'),
            btwNummer: formData.get('btwNummer'),
            website: formData.get('website'),
            contactpersoon: formData.get('contactpersoon'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            // 'type', 'taal', 'beschrijving' zijn geen standaard BedrijfModel velden, dus deze worden hier niet meegestuurd naar de DB.
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
    const renderBedrijfCard = (item, isRegistratieAanvraag = false) => ( // Naam aangepast
        <div key={item.id} className={`${isRegistratieAanvraag ? 'aanvraag' : 'bedrijf'}-card`}>
            <div className="bedrijf-header">
                <h3>{item.naam}</h3>
                <span className="sector-tag">{item.sector}</span>
            </div>
            <div className="bedrijf-meta">
                {isRegistratieAanvraag ? ( // Toon details voor registratieaanvraag
                    <>
                        <span>Contact: {item.contactpersoon || 'N/B'}</span>
                        <span>Email: {item.email || 'N/B'}</span>
                        <span>Tel: {item.phone || 'N/B'}</span>
                        <span>Adres: {item.adres || 'N/B'}</span>
                        <span>Website: {item.website || 'N/B'}</span>
                    </>
                ) : ( // Toon details voor goedgekeurd bedrijf
                    <>
                        <span>Contact: {item.contactpersoon || 'N/B'}</span>
                        <span>Email: {item.email || 'N/B'}</span>
                        <span>Tel: {item.phone || 'N/B'}</span>
                        <span>Adres: {item.adres || 'N/B'}</span>
                        <span>Website: {item.website || 'N/B'}</span>
                        {/* 'Type' en 'Taal' zijn momenteel niet in BedrijfModel, dus deze zijn placeholder */}
                        <span>Type: {item.type || 'N/B'}</span>
                        <span>Talen: {item.taal || 'N/B'}</span>
                        <span>Status: {item.status || 'N/B'}</span>
                    </>
                )}
            </div>
            {/* Beschrijving is niet in BedrijfModel, toon alleen voor aanvragen als dat relevant is */}
            {isRegistratieAanvraag && item.beschrijving && <p>{item.beschrijving}</p>} 
            <div className={`${isRegistratieAanvraag ? 'aanvraag' : 'bedrijf'}-acties`}>
                {isRegistratieAanvraag ? (
                    <>
                        <button className="accepteer-btn" onClick={() => handleRegistratieAanvraag(item.id, true)}>
                            <i className="fas fa-check-circle"></i> Goedkeuren
                        </button>
                        <button className="weiger-btn" onClick={() => handleRegistratieAanvraag(item.id, false)}>
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
                    placeholder="Zoek bedrijf, sector, contactpersoon of e-mail..."
                    value={zoekTerm}
                    onChange={(e) => setZoekTerm(e.target.value)}
                />
            </div>

            <div className="tabbladen">
                <button
                    className={actieveTab === 'geregistreerd' ? 'actief' : ''}
                    onClick={() => setActieveTab('geregistreerd')}
                >
                    Geregistreerde bedrijven ({filterItems(geregistreerdeBedrijven).length})
                </button>
                <button
                    className={actieveTab === 'aanvragen' ? 'actief' : ''}
                    onClick={() => setActieveTab('aanvragen')}
                >
                    Registratieaanvragen ({filterItems(registratieAanvragen).length})
                </button>
            </div>

            {actieveTab === 'geregistreerd' && (
                <div className="bedrijven-lijst">
                    <h2>Beschikbare bedrijven ({filterItems(geregistreerdeBedrijven).length})</h2>
                    {filterItems(geregistreerdeBedrijven).length > 0 ? (
                        filterItems(geregistreerdeBedrijven).map(bedrijf => renderBedrijfCard(bedrijf, false)) // false voor geregistreerd bedrijf
                    ) : (
                        <p className="text-center text-gray-500 mt-5">Geen geregistreerde bedrijven gevonden.</p>
                    )}
                </div>
            )}

            {actieveTab === 'aanvragen' && (
                <div className="aanvragen-lijst">
                    <h2>Registratieaanvragen ({filterItems(registratieAanvragen).length})</h2>
                    {filterItems(registratieAanvragen).length > 0 ? (
                        filterItems(registratieAanvragen).map(aanvraag => renderBedrijfCard(aanvraag, true)) // true voor registratieaanvraag
                    ) : (
                        <p className="text-center text-gray-500 mt-5">Geen registratieaanvragen gevonden.</p>
                    )}
                </div>
            )}


            {bewerkModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setBewerkModal(null)}>
                    <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-4">Bewerk {bewerkModal.naam}</h2>
                        <form onSubmit={saveEdit} className="space-y-4">
                            {/* de inform velden om te veranderen*/}
                            <div>
                                <label className="block font-medium mb-1">Naam:</label>
                                <input type="text" name="naam" defaultValue={bewerkModal.naam} required className="w-full border border-gray-300 rounded p-2" />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Sector:</label>
                                <input type="text" name="sector" defaultValue={bewerkModal.sector} required className="w-full border border-gray-300 rounded p-2" />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Adres:</label>
                                <input type="text" name="adres" defaultValue={bewerkModal.adres} className="w-full border border-gray-300 rounded p-2" />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">BTW-nummer:</label>
                                <input type="text" name="btwNummer" defaultValue={bewerkModal.btwNummer} className="w-full border border-gray-300 rounded p-2" />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Website:</label>
                                <input type="text" name="website" defaultValue={bewerkModal.website} className="w-full border border-gray-300 rounded p-2" />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Contactpersoon:</label>
                                <input type="text" name="contactpersoon" defaultValue={bewerkModal.contactpersoon} required className="w-full border border-gray-300 rounded p-2" />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Email:</label>
                                <input type="email" name="email" defaultValue={bewerkModal.email} required className="w-full border border-gray-300 rounded p-2" />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Telefoon:</label>
                                <input type="text" name="phone" defaultValue={bewerkModal.phone} required className="w-full border border-gray-300 rounded p-2" />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Type:</label>
                                <select name="type" defaultValue={bewerkModal.type} className="w-full border border-gray-300 rounded p-2">
                                    {['Stage', 'Studentjob', 'Bachelorproef', 'N/B'].map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Talen:</label>
                                <select name="taal" defaultValue={bewerkModal.taal} className="w-full border border-gray-300 rounded p-2">
                                    {['Nederlands', 'Engels', 'Frans', 'N/B'].map(taal => (
                                    <option key={taal} value={taal}>{taal}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Beschrijving:</label>
                                <textarea name="beschrijving" defaultValue={bewerkModal.beschrijving} className="w-full border border-gray-300 rounded p-2" />
                            </div>
                            <div className="flex justify-end gap-4 mt-4">
                                <button type="button" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded" onClick={() => setBewerkModal(null)}>
                                    Annuleren
                                </button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                                    Opslaan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bedrijvenbeheer;