import Aanvraag from '../models/aanvraagModel.js';
import Speeddate from '../models/speeddateModel.js';
import Student from '../models/studentModel.js';
import Bedrijf from '../models/bedrijfModel.js';

// NIEUWE FUNCTIE: Tellen van alle aanvragen met status 'in behandeling' (voor alerts)
const countPendingAanvragen = async (req, res) => {
  try {
    const count = await Aanvraag.countDocuments({ status: 'in behandeling' });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Fout bij het tellen van in behandeling zijnde aanvragen:', error);
    res.status(500).json({ message: 'Er ging iets mis bij het tellen van aanvragen.', error: error.message });
  }
};

// NIEUWE FUNCTIE: Alle aanvragen met status 'in behandeling' ophalen (voor admin)
const getAllPendingAanvragen = async (req, res) => {
  try {
    const aanvragen = await Aanvraag.find({ status: 'in behandeling' })
      .populate({
        path: 'speeddate',
        select: 'starttijd eindtijd vakgebied focus opportuniteit talen beschrijving bedrijf',
        populate: {
          path: 'bedrijf',
          select: 'name sector',
        }
      })
      .populate({
        path: 'student',
        select: 'voornaam achternaam opleiding email talen', // Toegevoegd voornaam, achternaam, talen
      })
      .sort({ createdAt: -1 });

    const formattedAanvragen = aanvragen.map(aanvraag => ({
      id: aanvraag._id, // Gebruik 'id' in plaats van '_id' voor consistentie frontend
      naam: aanvraag.speeddate.bedrijf?.name || 'Onbekend Bedrijf', // Bedrijfsnaam
      sector: aanvraag.speeddate.bedrijf?.sector || 'N/B', // Sector van bedrijf
      taal: aanvraag.speeddate.talen.join(', ') || 'N/B', // Talen van de speeddate
      type: aanvraag.speeddate.vakgebied || 'N/B', // Vakgebied als 'type'
      beschrijving: aanvraag.speeddate.beschrijving || 'N/B',
      status: aanvraag.status,
      studentNaam: `${aanvraag.student?.voornaam || ''} ${aanvraag.student?.achternaam || ''}`.trim() || 'Onbekend',
      studentOpleiding: aanvraag.student?.opleiding || 'N/B',
      studentEmail: aanvraag.student?.email || 'N/B',
      studentTalen: aanvraag.student?.talen.join(', ') || 'N/B',
      // Voeg hier andere relevante velden toe die de admin nodig heeft
    }));

    res.status(200).json(formattedAanvragen);
  } catch (error) {
    console.error('Fout bij het ophalen van alle in behandeling zijnde aanvragen:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het ophalen van de aanvragen.',
      error: error.message,
    });
  }
};

// 1. Functie om een aanvraag voor een speeddate te creëren (door student)
const createAanvraag = async (req, res) => {
  try {
    const { speeddateId, studentId } = req.body;

    if (!speeddateId || !studentId) {
      return res.status(400).json({ message: 'Speeddate ID en Student ID zijn vereist.' });
    }

    const speeddate = await Speeddate.findById(speeddateId);
    if (!speeddate) {
      return res.status(404).json({ message: 'Speeddate niet gevonden.' });
    }
    if (speeddate.status !== 'open') {
      return res.status(400).json({ message: 'Deze speeddate is niet beschikbaar voor aanvragen.' });
    }

    const existingAanvraag = await Aanvraag.findOne({ speeddate: speeddateId, student: studentId });
    if (existingAanvraag) {
      return res.status(409).json({ message: 'Je hebt al een aanvraag voor deze speeddate ingediend.' });
    }

    const bedrijfId = speeddate.bedrijf;

    const newAanvraag = new Aanvraag({
      speeddate: speeddateId,
      student: studentId,
      bedrijf: bedrijfId,
      status: 'in behandeling',
    });

    const savedAanvraag = await newAanvraag.save();

    speeddate.status = 'aangevraagd';
    speeddate.aangevraagdDoor = studentId;
    await speeddate.save();

    res.status(201).json({
      message: 'Aanvraag succesvol ingediend.',
      aanvraag: savedAanvraag,
    });
  } catch (error) {
    console.error('Fout bij het creëren van aanvraag:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het indienen van de aanvraag.',
      error: error.message,
    });
  }
};

// 2. Functie om alle aanvragen van een specifieke student op te halen (voor "Mijn Aanvragen")
const getStudentAanvragen = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is vereist.' });
    }

    const aanvragen = await Aanvraag.find({ student: studentId })
      .populate({
        path: 'speeddate',
        select: 'starttijd eindtijd vakgebied focus opportuniteit talen beschrijving bedrijf',
        populate: {
          path: 'bedrijf',
          select: 'name sector',
        }
      })
      .sort({ createdAt: -1 });

    const formattedAanvragen = aanvragen.map(aanvraag => ({
      _id: aanvraag._id,
      speeddateId: aanvraag.speeddate._id,
      bedrijfNaam: aanvraag.speeddate.bedrijf?.name || 'Onbekend Bedrijf',
      sector: aanvraag.speeddate.bedrijf?.sector || 'N/B',
      starttijd: aanvraag.speeddate.starttijd,
      eindtijd: aanvraag.speeddate.eindtijd,
      vakgebied: aanvraag.speeddate.vakgebied,
      focus: aanvraag.speeddate.focus,
      opportuniteit: aanvraag.speeddate.opportuniteit,
      talen: aanvraag.speeddate.talen,
      beschrijving: aanvraag.speeddate.beschrijving,
      status: aanvraag.status,
      afspraakDetails: {
        tijd: `${aanvraag.speeddate.starttijd} - ${aanvraag.speeddate.eindtijd}`,
        lokaal: aanvraag.afspraakDetails?.lokaal || 'Nader te bepalen',
      },
      createdAt: aanvraag.createdAt,
    }));

    res.status(200).json(formattedAanvragen);
  } catch (error) {
    console.error('Fout bij het ophalen van student aanvragen:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het ophalen van jouw aanvragen.',
      error: error.message,
    });
  }
};

// 3. Functie om alle aanvragen voor een specifiek bedrijf op te halen (voor "Aanvragen" pagina van bedrijf)
const getBedrijfAanvragen = async (req, res) => {
  try {
    const { bedrijfId } = req.params;

    if (!bedrijfId) {
      return res.status(400).json({ message: 'Bedrijf ID is vereist.' });
    }

    const aanvragen = await Aanvraag.find({ bedrijf: bedrijfId })
      .populate({
        path: 'student',
        select: 'name opleiding email taal',
      })
      .populate({
        path: 'speeddate',
        select: 'starttijd eindtijd vakgebied focus',
      })
      .sort({ createdAt: -1 });

    const formattedAanvragen = aanvragen.map(aanvraag => ({
      _id: aanvraag._id,
      speeddateId: aanvraag.speeddate._id,
      studentId: aanvraag.student._id,
      studentNaam: aanvraag.student?.name || 'Onbekend',
      studentOpleiding: aanvraag.student?.opleiding || 'N/B',
      studentEmail: aanvraag.student?.email || 'N/B',
      studentTaal: aanvraag.student?.taal || 'N/B',
      speeddateTijd: `${aanvraag.speeddate.starttijd} - ${aanvraag.speeddate.eindtijd}`,
      speeddateFocus: aanvraag.speeddate.focus,
      status: aanvraag.status,
      afspraakDetails: aanvraag.afspraakDetails,
      createdAt: aanvraag.createdAt,
    }));

    res.status(200).json(formattedAanvragen);
  } catch (error) {
    console.error('Fout bij het ophalen van bedrijfs aanvragen:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het ophalen van aanvragen voor dit bedrijf.',
      error: error.message,
    });
  }
};


// 4. Functie om de status van een aanvraag bij te werken (door bedrijf)
const updateAanvraagStatus = async (req, res) => {
  try {
    const { aanvraagId } = req.params;
    const { status, afspraakDetails = {} } = req.body;

    if (!aanvraagId || !status) {
      return res.status(400).json({ message: 'Aanvraag ID en status zijn vereist.' });
    }

    const aanvraag = await Aanvraag.findById(aanvraagId).populate('speeddate');
    if (!aanvraag) {
      return res.status(404).json({ message: 'Aanvraag niet gevonden.' });
    }
    if (!aanvraag.speeddate) {
        return res.status(404).json({ message: 'Gekoppelde speeddate niet gevonden.' });
    }

    const oldStatus = aanvraag.status;
    aanvraag.status = status;

    if (status === 'goedgekeurd') {
      aanvraag.afspraakDetails.tijd = `${aanvraag.speeddate.starttijd} - ${aanvraag.speeddate.eindtijd}`;
      aanvraag.afspraakDetails.lokaal = afspraakDetails.lokaal || aanvraag.speeddate.lokaal;

      aanvraag.speeddate.status = 'bevestigd';
      await aanvraag.speeddate.save();

    } else if (status === 'afgekeurd') {
      aanvraag.speeddate.status = 'open';
      aanvraag.speeddate.aangevraagdDoor = null;
      await aanvraag.speeddate.save();
      aanvraag.afspraakDetails = {};

    } else if (status === 'in behandeling' && oldStatus !== 'in behandeling') {
      aanvraag.speeddate.status = 'aangevraagd';
      await aanvraag.speeddate.save();
      aanvraag.afspraakDetails = {};
    }

    const updatedAanvraag = await aanvraag.save();

    res.status(200).json({
      message: 'Aanvraag status succesvol bijgewerkt.',
      aanvraag: updatedAanvraag,
    });
  } catch (error) {
    console.error('Fout bij het bijwerken van aanvraag status:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het bijwerken van de aanvraag status.',
      error: error.message,
    });
  }
};


// 5. Functie om een aanvraag te annuleren/verwijderen (door student)
const deleteAanvraag = async (req, res) => {
  try {
    const { aanvraagId } = req.params;

    const aanvraag = await Aanvraag.findById(aanvraagId).populate('speeddate');
    if (!aanvraag) {
      return res.status(404).json({ message: 'Aanvraag niet gevonden.' });
    }

    if (aanvraag.speeddate && aanvraag.speeddate.status === 'aangevraagd') {
      aanvraag.speeddate.status = 'open';
      aanvraag.speeddate.aangevraagdDoor = null;
      await aanvraag.speeddate.save();
    } else if (aanvraag.speeddate && aanvraag.speeddate.status === 'bevestigd') {
        return res.status(400).json({ message: 'Bevestigde afspraken kunnen niet geannuleerd worden via deze weg. Neem contact op met het bedrijf.' });
    }

    await Aanvraag.findByIdAndDelete(aanvraagId);

    res.status(200).json({ message: 'Aanvraag succesvol geannuleerd.' });
  } catch (error) {
    console.error('Fout bij het annuleren van aanvraag:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het annuleren van de aanvraag.',
      error: error.message,
    });
  }
};

// 6. Functie om alle goedgekeurde afspraken voor een student op te halen (voor "Mijn Afspraken")
const getStudentAfspraken = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is vereist.' });
    }

    const afspraken = await Aanvraag.find({ student: studentId, status: 'goedgekeurd' })
      .populate({
        path: 'speeddate',
        select: 'starttijd eindtijd vakgebied focus bedrijf lokaal',
        populate: {
          path: 'bedrijf',
          select: 'name sector',
        }
      })
      .sort({ createdAt: 1 });

    const formattedAfspraken = afspraken.map(afspraak => ({
      _id: afspraak._id,
      speeddateId: afspraak.speeddate._id,
      bedrijfNaam: afspraak.speeddate.bedrijf?.name || 'Onbekend Bedrijf',
      sector: afspraak.speeddate.bedrijf?.sector || 'N/B',
      focus: afspraak.speeddate.focus,
      tijd: `${afspraak.speeddate.starttijd} - ${afspraak.speeddate.eindtijd}`,
      lokaal: afspraak.speeddate.lokaal || 'Nader te bepalen',
    }));

    res.status(200).json(formattedAfspraken);
  } catch (error) {
    console.error('Fout bij het ophalen van student afspraken:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het ophalen van jouw afspraken.',
      error: error.message,
    });
  }
};

export {
  createAanvraag,
  getStudentAanvragen,
  getBedrijfAanvragen,
  updateAanvraagStatus,
  deleteAanvraag,
  getStudentAfspraken,
  countPendingAanvragen, // Exporteren de nieuwe functie
  getAllPendingAanvragen, // Exporteren de nieuwe functie
};