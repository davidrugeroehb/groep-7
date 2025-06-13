import Speeddate from '../models/speeddateModel.js';
import Student from '../models/studentModel.js';

const getAllStudenten= async(req,res)=>{
  try{
    const studenten=await Student.find().select('-password');
    res.status(200).json(studenten)
  }catch(err){
    res.status(500).json({message:'Fout bij het ophalen van studenten',error: err.message})
  }
}

// NIEUWE FUNCTIE: Tellen van alle studenten
const countAllStudents = async (req, res) => {
  try {
    const count = await Student.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Fout bij het tellen van studenten:', error);
    res.status(500).json({ message: 'Er ging iets mis bij het tellen van studenten.', error: error.message });
  }
};

// Functie om alle speeddates voor studenten op te halen (bestaat al)
const getAllSpeeddates = async (req, res) => {
  try {
    const speeddates = await Speeddate.find({})
      .populate({
        path: 'bedrijf',
        select: 'name sector' // Om bedrijfsnaam in speeddate te tonen
      });

    res.status(200).json({
      message: 'Alle speeddates succesvol opgehaald.',
      speeddates: speeddates,
    });
  } catch (error) {
    console.error('Fout bij het ophalen van alle speeddates:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het ophalen van alle speeddates.',
      error: error.message,
    });
  }
};

// NIEUWE FUNCTIE: Profiel van een specifieke student ophalen
const getStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params; // ID komt uit de URL

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is vereist om profiel op te halen.' });
    }

    const student = await Student.findById(studentId).select('-password'); // Haal student op, exclusief wachtwoord

    if (!student) {
      return res.status(404).json({ message: 'Student niet gevonden.' });
    }

    res.status(200).json({
      message: 'Student profiel succesvol opgehaald.',
      profile: student,
    });
  } catch (error) {
    console.error('Fout bij het ophalen van student profiel:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het ophalen van het student profiel.',
      error: error.message,
    });
  }
};

// Functie om het student profiel bij te werken
const updateStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    const updateData = req.body; // De gegevens die moeten worden bijgewerkt

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is vereist om profiel bij te werken.' });
    }

    // Voorkom dat wachtwoord direct wordt bijgewerkt via deze route, tenzij het specifiek is afgeschermd
    delete updateData.password;
    // Overweeg ook om email niet via deze route te laten bijwerken als het 'unique' is en conflicten kan geven.

    const updatedStudent = await Student.findByIdAndUpdate(studentId, updateData, { new: true, runValidators: true }).select('-password');

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student niet gevonden.' });
    }

    res.status(200).json({
      message: 'Student profiel succesvol bijgewerkt.',
      profile: updatedStudent,
    });
  } catch (error) {
    console.error('Fout bij het bijwerken van student profiel:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het bijwerken van het student profiel.',
      error: error.message,
    });
  }
};


export {
  getAllSpeeddates,
  getStudentProfile,
  updateStudentProfile,
  getAllStudenten,
  countAllStudents // Exporteren van de nieuwe functie
};