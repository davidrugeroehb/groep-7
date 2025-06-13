import AboutModel from '../models/aboutModel.js'; // Zorg dat je aboutModel importeert

// Functie om de "About" tekst op te halen
const getabout = async (req, res) => {
    try {
        // Haal het About document op. Aangenomen dat er slechts één is, of de eerste.
        const about = await AboutModel.findOne();

        if (!about) {
            // Als er geen "About" document is, creëer er dan een standaard
            const newAbout = await AboutModel.create({ tekst_about: "Welkom bij Career Match! Dit is de standaard over ons tekst. Je kunt deze bewerken via het admin panel." });
            return res.status(200).json({ tekst_about: newAbout.tekst_about });
        }

        res.status(200).json({ tekst_about: about.tekst_about });
    } catch (error) {
        console.error('Fout bij het ophalen van "About" tekst:', error);
        res.status(500).json({ message: 'Er ging iets mis bij het ophalen van de "About" tekst.', error: error.message });
    }
};

// Functie om de "About" tekst bij te werken
const updateabout = async (req, res) => {
    try {
        const { tekst } = req.body;
        if (!tekst) {
            return res.status(400).json({ message: 'Tekst is vereist om de "About" sectie bij te werken.' });
        }

        // Zoek en update het "About" document. Creëer er een als het niet bestaat.
        const updatedAbout = await AboutModel.findOneAndUpdate({}, { tekst_about: tekst }, { new: true, upsert: true });

        res.status(200).json({
            message: 'About tekst succesvol bijgewerkt.',
            tekst_about: updatedAbout.tekst_about
        });
    } catch (error) {
        console.error('Fout bij het bijwerken van "About" tekst:', error);
        res.status(500).json({ message: 'Er ging iets mis bij het bijwerken van de "About" tekst.', error: error.message });
    }
};

export {
    getabout,
    updateabout
};