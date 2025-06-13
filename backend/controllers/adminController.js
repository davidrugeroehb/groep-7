// backend/controllers/adminController.js
import Admin from '../models/adminModel.js'; // Zorg dat je adminModel import

// Functie om admin profiel op te halen
const getAdminProfile = async (req, res) => {
    try {
        // De admin ID zou normaal uit de token moeten komen, niet uit de URL als '1'
        // Voor nu, aangenomen dat de admin ID uit de req.user (na auth middleware) komt,
        // of dat we een specifieke admin ID gebruiken voor demo.
        // Als u authenticatie gebruikt, haalt u de ID op via req.user.id
        const adminId = req.user?.id; // Aangenomen dat req.user.id beschikbaar is na authenticatie middleware
        if (!adminId) {
            return res.status(400).json({ message: 'Admin ID is vereist om profiel op te halen.' });
        }

        const admin = await Admin.findById(adminId).select('-password'); // Haal admin op zonder wachtwoord

        if (!admin) {
            return res.status(404).json({ message: 'Admin niet gevonden.' });
        }

        res.status(200).json({
            message: 'Admin profiel succesvol opgehaald.',
            profile: admin,
            role: 'admin' // Zorg dat de rol ook meegestuurd wordt
        });
    } catch (error) {
        console.error('Fout bij het ophalen van admin profiel:', error);
        res.status(500).json({ message: 'Er ging iets mis bij het ophalen van het admin profiel.', error: error.message });
    }
};

// Functie om admin profiel bij te werken (optioneel)
const updateAdminProfile = async (req, res) => {
    try {
        const adminId = req.user?.id; // Haal admin ID op via authenticatie
        const updateData = req.body;

        if (!adminId) {
            return res.status(400).json({ message: 'Admin ID is vereist om profiel bij te werken.' });
        }

        delete updateData.password; // Voorkom direct wachtwoord bijwerken

        const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, { new: true, runValidators: true }).select('-password');

        if (!updatedAdmin) {
            return res.status(404).json({ message: 'Admin niet gevonden.' });
        }

        res.status(200).json({
            message: 'Admin profiel succesvol bijgewerkt.',
            profile: updatedAdmin,
            role: 'admin'
        });
    } catch (error) {
        console.error('Fout bij het bijwerken van admin profiel:', error);
        res.status(500).json({ message: 'Er ging iets mis bij het bijwerken van het admin profiel.', error: error.message });
    }
};

export {
    getAdminProfile,
    updateAdminProfile
};