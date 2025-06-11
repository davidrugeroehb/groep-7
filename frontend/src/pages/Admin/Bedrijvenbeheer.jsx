import React, { useState } from 'react';
import './Bedrijvenbeheer.css';

const Bedrijvenbeheer = () => {
    // Initial state
    const initialBedrijven = [
        {
            id: 1,
            naam: 'TechSolutions',
            sector: 'Web Development',
            taal: 'Nederlands',
            type: 'Stage',
            beschrijving: 'Stageplek voor front-end development met React. Wij zoeken een gemotiveerde stagiair die ons team komt versterken in het ontwikkelen van moderne webapplicaties.',
            status: 'actief'
        },
        {
            id: 2,
            naam: 'AI Minds',
            sector: 'AI Machine Learning',
            taal: 'Engels',
            type: 'Studentjob',
            beschrijving: 'AI Minds ontwikkelt toepassingen met machine learning en data-analyse. Werkt aan innovatieve AI oplossingen.',
            status: 'actief'
        }
    ];


    const initialAanvragen = [
        {
            id: 3,
            naam: 'CloudExperts',
            sector: 'DevOps',
            taal: 'Frans',
            type: 'Bachelorproef',
            beschrijving: 'CloudExperts biedt stageplekken aan voor DevOps engineers in opleiding.',
            status: 'in afwachting'
        }
    ];


    const [bedrijven, setBedrijven] = useState(initialBedrijven);
    const [aanvragen, setAanvragen] = useState(initialAanvragen);
    const [zoekTerm, setZoekTerm] = useState('');
    const [actieveTab, setActieveTab] = useState('geregistreerd');
    const [bewerkModal, setBewerkModal] = useState(null);


    // Helper functions
    const filterItems = (items) =>
        items.filter(item =>
            item.naam.toLowerCase().includes(zoekTerm.toLowerCase()) ||
            item.sector.toLowerCase().includes(zoekTerm.toLowerCase())
        );


    const handleAanvraag = (id, accept = false) => {
        const aanvraag = aanvragen.find(a => a.id === id);
        if (accept && aanvraag) {
            setBedrijven([...bedrijven, { ...aanvraag, status: 'actief' }]);
        }
        setAanvragen(aanvragen.filter(a => a.id !== id));
    };


    const toggleStatus = (id) => {
        setBedrijven(bedrijven.map(b =>
            b.id === id ? { ...b, status: b.status === 'actief' ? 'inactief' : 'actief' } : b
        ));
    };


    const saveEdit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedBedrijf = {
            ...bewerkModal,
            naam: formData.get('naam'),
            sector: formData.get('sector'),
            type: formData.get('type'),
            taal: formData.get('taal'),
            beschrijving: formData.get('beschrijving')
        };
       
        setBedrijven(bedrijven.map(b => b.id === updatedBedrijf.id ? updatedBedrijf : b));
        setBewerkModal(null);
    };


    // Component rendering
    const renderBedrijfCard = (item, isAanvraag = false) => (
        <div key={item.id} className={`${isAanvraag ? 'aanvraag' : 'bedrijf'}-card`}>
            <div className="bedrijf-header">
                <h3>{item.naam}</h3>
                <span>{item.sector}</span>
            </div>
            <div className="bedrijf-meta">
                <span>{item.type}</span>
                <span>{item.taal}</span>
                {!isAanvraag && <span>Status: {item.status}</span>}
            </div>
            <p>{item.beschrijving}</p>
            <div className={`${isAanvraag ? 'aanvraag' : 'bedrijf'}-acties`}>
                {isAanvraag ? (
                    <>
                        <button className="accepteer-btn" onClick={() => handleAanvraag(item.id, true)}>
                            Goedkeuren
                        </button>
                        <button className="weiger-btn" onClick={() => handleAanvraag(item.id)}>
                            Weigeren
                        </button>
                    </>
                ) : (
                    <>
                        <button className="bewerk-btn" onClick={() => setBewerkModal(item)}>
                            Bewerken
                        </button>
                        <button
                            className={item.status === 'actief' ? 'deactiveer-btn' : 'activeer-btn'}
                            onClick={() => toggleStatus(item.id)}
                        >
                            {item.status === 'actief' ? 'Desactiveren' : 'Activeren'}
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
                    placeholder="Zoek bedrijf of sector..."
                    value={zoekTerm}
                    onChange={(e) => setZoekTerm(e.target.value)}
                />
            </div>


            <div className="tabbladen">
                <button
                    className={actieveTab === 'geregistreerd' ? 'actief' : ''}
                    onClick={() => setActieveTab('geregistreerd')}
                >
                    Geregistreerde bedrijven ({bedrijven.length})
                </button>
                <button
                    className={actieveTab === 'aanvragen' ? 'actief' : ''}
                    onClick={() => setActieveTab('aanvragen')}
                >
                    Registratieaanvragen ({aanvragen.length})
                </button>
            </div>


            {actieveTab === 'geregistreerd' && (
                <div className="bedrijven-lijst">
                    <h2>Beschikbare bedrijven ({filterItems(bedrijven).length})</h2>
                    {filterItems(bedrijven).map(bedrijf => renderBedrijfCard(bedrijf))}
                </div>
            )}


            {actieveTab === 'aanvragen' && (
                <div className="aanvragen-lijst">
                    <h2>Registratieaanvragen ({filterItems(aanvragen).length})</h2>
                    {filterItems(aanvragen).map(aanvraag => renderBedrijfCard(aanvraag, true))}
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
