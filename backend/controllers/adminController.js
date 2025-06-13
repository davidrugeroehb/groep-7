import Admin from '../models/adminModel.js';

const getAdminProfile = async (req, res) => {
    try {
        const { adminId } = req.params; // Haalt de ID op uit de URL (e.g. '/mijnprofiel/123')

        if (!adminId) {
            return res.status(400).json({ message: 'Admin ID is vereist om profiel op te halen.' });
        }

        const admin = await Admin.findById(adminId).select('-password');

        if (!admin) {
            // Retourneer 404 als de admin niet gevonden is met de opgegeven ID
            return res.status(404).json({ message: 'Admin niet gevonden met de opgegeven ID.' });
        }

        res.status(200).json({
            message: 'Admin profiel succesvol opgehaald.',
            profile: admin,
            role: 'admin'
        });
    } catch (error) {
        console.error('Fout bij het ophalen van admin profiel:', error);
        res.status(500).json({ message: 'Er ging iets mis bij het ophalen van het admin profiel.', error: error.message });
    }
};

const updateAdminProfile = async (req, res) => {
    try {
        const { adminId } = req.params;
        const updateData = req.body;

        if (!adminId) {
            return res.status(400).json({ message: 'Admin ID is vereist om profiel bij te werken.' });
        }

        delete updateData.password;

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