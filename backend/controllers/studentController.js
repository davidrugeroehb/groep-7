import Speeddate from '../models/speeddateModel.js';
import Student from '../models/studentModel.js';

const getAllStudenten = async (req, res) => {
  try {
    const studenten = await Student.find().select('-password');
    res.status(200).json(studenten)
  } catch (err) {
    res.status(500).json({ message: 'Fout bij het ophalen van studenten', error: err.message })
  }
}

const countAllStudents = async (req, res) => {
  try {
    const count = await Student.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Fout bij het tellen van studenten:', error);
    res.status(500).json({ message: 'Er ging iets mis bij het tellen van studenten.', error: error.message });
  }
};

// Functie om een specifieke student te verwijderen
const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params; // Haal de studentId op uit de URL parameters

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is vereist om student te verwijderen.' });
    }

    const deletedStudent = await Student.findByIdAndDelete(studentId); // Zoek en verwijder de student

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student niet gevonden.' });
    }

    res.status(200).json({ message: 'Student succesvol verwijderd.', student: deletedStudent });
  } catch (error) {
    console.error('Fout bij het verwijderen van student:', error);
    res.status(500).json({ message: 'Er ging iets mis bij het verwijderen van de student.', error: error.message });
  }
};


const getAllSpeeddates = async (req, res) => {
  try {
    const speeddates = await Speeddate.find({})
      .populate({
        path: 'bedrijf',
        select: 'name sector'
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

const getStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is vereist om profiel op te halen.' });
    }

    const student = await Student.findById(studentId).select('-password');

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

const updateStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    const updateData = req.body;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is vereist om profiel bij te werken.' });
    }

    delete updateData.password;

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
  countAllStudents,
  deleteStudent // Exporteer de nieuwe functie
};