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
        select: 'starttijd eindtijd vakgebied focus opportuniteit talen beschrijving bedrijf lokaal slots', // Include 'slots' and 'lokaal'
        populate: {
          path: 'bedrijf',
          select: 'name sector',
        }
      })
      .populate({
        path: 'student',
        select: 'voornaam achternaam opleiding email talen',
      })
      .sort({ createdAt: -1 });

    const formattedAanvragen = aanvragen.map(aanvraag => {
      const selectedSlot = aanvraag.speeddate?.slots.id(aanvraag.slot); // Find the specific slot
      const slotTijd = selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : 'N/B';
      const slotLokaal = aanvraag.speeddate?.lokaal || 'N/B'; // Lokaal is op hoofd speeddate niveau

      return {
        id: aanvraag._id,
        naam: aanvraag.speeddate?.bedrijf?.name || 'Onbekend Bedrijf',
        sector: aanvraag.speeddate?.bedrijf?.sector || 'N/B',
        taal: aanvraag.speeddate?.talen.join(', ') || 'N/B',
        type: aanvraag.speeddate?.vakgebied || 'N/B',
        beschrijving: aanvraag.speeddate?.beschrijving || 'N/B',
        status: aanvraag.status,
        studentNaam: `${aanvraag.student?.voornaam || ''} ${aanvraag.student?.achternaam || ''}`.trim() || 'Onbekend',
        studentOpleiding: aanvraag.student?.opleiding || 'N/B',
        studentEmail: aanvraag.student?.email || 'N/B',
        studentTalen: aanvraag.student?.talen.join(', ') || 'N/B',
        speeddateTijd: slotTijd, // Use specific slot time
        speeddateLokaal: slotLokaal, // Use main speeddate lokaal
        // Add more relevant fields if needed for admin view
      };
    });

    res.status(200).json(formattedAanvragen);
  } catch (error) {
    console.error('Fout bij het ophalen van alle in behandeling zijnde aanvragen:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het ophalen van de aanvragen.',
      error: error.message,
    });
  }
};

// 1. Functie om een aanvraag voor een speeddate slot te creëren (door student)
const createAanvraag = async (req, res) => {
  try {
    const { speeddateId, slotId, studentId } = req.body;

    if (!speeddateId || !slotId || !studentId) {
      return res.status(400).json({ message: 'Speeddate ID, Slot ID en Student ID zijn vereist.' });
    }

    const speeddate = await Speeddate.findById(speeddateId);
    if (!speeddate) {
      return res.status(404).json({ message: 'Hoofd Speeddate niet gevonden.' });
    }

    const slot = speeddate.slots.id(slotId); // Find the specific slot by its _id
    if (!slot) {
      return res.status(404).json({ message: 'Specifieke tijdslot niet gevonden binnen deze speeddate.' });
    }

    if (slot.status !== 'open') {
      return res.status(400).json({ message: 'Dit tijdslot is niet beschikbaar voor aanvragen of reeds geboekt.' });
    }

    // Cruciale validatie: Controleer of de student al een aanvraag heeft ingediend voor ENIG slot binnen deze HOOFD speeddate
    const existingApplicationForMainSpeeddate = await Aanvraag.findOne({
      speeddate: speeddateId,
      student: studentId,
      status: { $in: ['in behandeling', 'goedgekeurd'] } // Already applied or approved for any slot in this main speeddate
    });

    if (existingApplicationForMainSpeeddate) {
      return res.status(409).json({ message: 'Je hebt al een aanvraag voor een slot binnen deze speeddate ingediend. Eén aanvraag per speeddate toegestaan.' });
    }

    // Update the status of the specific slot
    slot.status = 'aangevraagd';
    slot.student = studentId;

    const bedrijfId = speeddate.bedrijf;

    const newAanvraag = new Aanvraag({
      speeddate: speeddateId,
      slot: slotId, // Store the slot ID
      student: studentId,
      bedrijf: bedrijfId,
      status: 'in behandeling',
      afspraakDetails: { // Populate with slot details
        tijd: `${slot.startTime} - ${slot.endTime}`,
        lokaal: speeddate.lokaal, // Lokaal comes from the main speeddate
      }
    });

    const savedAanvraag = await newAanvraag.save();
    await speeddate.save(); // Save the parent speeddate to persist slot changes

    res.status(201).json({
      message: 'Aanvraag voor tijdslot succesvol ingediend.',
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
        select: 'starttijd eindtijd vakgebied focus opportuniteit talen beschrijving bedrijf lokaal slots', // Include slots and lokaal
        populate: {
          path: 'bedrijf',
          select: 'name sector',
        }
      })
      .sort({ createdAt: -1 });

    const formattedAanvragen = aanvragen.map(aanvraag => {
      const selectedSlot = aanvraag.speeddate?.slots.id(aanvraag.slot); // Find the specific slot
      const slotStartTime = selectedSlot ? selectedSlot.startTime : 'N/B';
      const slotEndTime = selectedSlot ? selectedSlot.endTime : 'N/B';
      const slotLokaal = aanvraag.speeddate?.lokaal || 'N/B';

      return {
        _id: aanvraag._id,
        speeddateId: aanvraag.speeddate?._id,
        slotId: aanvraag.slot,
        bedrijfNaam: aanvraag.speeddate?.bedrijf?.name || 'Onbekend Bedrijf',
        sector: aanvraag.speeddate?.bedrijf?.sector || 'N/B',
        // Use slot specific times
        starttijd: slotStartTime,
        eindtijd: slotEndTime,
        lokaal: slotLokaal, // Use main speeddate lokaal
        vakgebied: aanvraag.speeddate?.vakgebied,
        focus: aanvraag.speeddate?.focus,
        opportuniteit: aanvraag.speeddate?.opportuniteit,
        talen: aanvraag.speeddate?.talen,
        beschrijving: aanvraag.speeddate?.beschrijving,
        status: aanvraag.status,
        // afspraakDetails is now primarily derived from the slot for display
        afspraakDetails: {
          tijd: `${slotStartTime} - ${slotEndTime}`,
          lokaal: slotLokaal,
        },
        createdAt: aanvraag.createdAt,
      };
    });

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
        select: 'starttijd eindtijd vakgebied focus lokaal slots', // Include slots and lokaal
      })
      .sort({ createdAt: -1 });

    const formattedAanvragen = aanvragen.map(aanvraag => {
      const selectedSlot = aanvraag.speeddate?.slots.id(aanvraag.slot); // Find the specific slot
      const slotTijd = selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : 'N/B';
      const slotLokaal = aanvraag.speeddate?.lokaal || 'N/B';

      return {
        _id: aanvraag._id,
        speeddateId: aanvraag.speeddate?._id,
        slotId: aanvraag.slot,
        studentId: aanvraag.student?._id,
        studentNaam: aanvraag.student?.name || 'Onbekend',
        studentOpleiding: aanvraag.student?.opleiding || 'N/B',
        studentEmail: aanvraag.student?.email || 'N/B',
        studentTaal: aanvraag.student?.taal || 'N/B',
        speeddateTijd: slotTijd, // Use specific slot time
        speeddateFocus: aanvraag.speeddate?.focus,
        speeddateLokaal: slotLokaal,
        status: aanvraag.status,
        afspraakDetails: aanvraag.afspraakDetails,
        createdAt: aanvraag.createdAt,
      };
    });

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
    const { status } = req.body; // afspraakDetails now derived from slot

    if (!aanvraagId || !status) {
      return res.status(400).json({ message: 'Aanvraag ID en status zijn vereist.' });
    }

    const aanvraag = await Aanvraag.findById(aanvraagId);
    if (!aanvraag) {
      return res.status(404).json({ message: 'Aanvraag niet gevonden.' });
    }

    const speeddate = await Speeddate.findById(aanvraag.speeddate);
    if (!speeddate) {
      return res.status(404).json({ message: 'Gekoppelde speeddate niet gevonden.' });
    }

    const slot = speeddate.slots.id(aanvraag.slot);
    if (!slot) {
      return res.status(404).json({ message: 'Gekoppelde tijdslot niet gevonden.' });
    }

    const oldAanvraagStatus = aanvraag.status;
    aanvraag.status = status;

    if (status === 'goedgekeurd') {
      if (slot.status !== 'open' && slot.status !== 'aangevraagd') {
        return res.status(400).json({ message: 'Dit slot is al bezet of niet beschikbaar.' });
      }
      slot.status = 'bevestigd';
      slot.student = aanvraag.student; // Confirm the student for this slot
      aanvraag.afspraakDetails.tijd = `${slot.startTime} - ${slot.endTime}`;
      aanvraag.afspraakDetails.lokaal = speeddate.lokaal; // Lokaal van de hoofd-speeddate

    } else if (status === 'afgekeurd') {
      // If a slot was previously 'aangevraagd' by this student, reset it to 'open'
      if (slot.student?.toString() === aanvraag.student.toString() && slot.status === 'aangevraagd') {
        slot.status = 'open';
        slot.student = null;
      }
      aanvraag.afspraakDetails = {}; // Clear details
    }
    // No change for 'in behandeling' status from this endpoint

    const updatedAanvraag = await aanvraag.save();
    await speeddate.save(); // Save the parent speeddate to persist slot changes

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

    const aanvraag = await Aanvraag.findById(aanvraagId);
    if (!aanvraag) {
      return res.status(404).json({ message: 'Aanvraag niet gevonden.' });
    }

    const speeddate = await Speeddate.findById(aanvraag.speeddate);
    // If speeddate or slot no longer exists, just delete the aanvraag
    if (speeddate) {
        const slot = speeddate.slots.id(aanvraag.slot);
        if (slot) {
            // Only reset slot if it was requested by this student and not yet confirmed by company
            if (slot.student?.toString() === aanvraag.student.toString() && (slot.status === 'aangevraagd' || slot.status === 'in behandeling')) {
                slot.status = 'open';
                slot.student = null;
                await speeddate.save(); // Save speeddate changes
            } else if (slot.status === 'bevestigd') {
                return res.status(400).json({ message: 'Bevestigde afspraken kunnen niet geannuleerd worden via deze weg. Neem contact op met het bedrijf.' });
            }
        }
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
        select: 'starttijd eindtijd vakgebied focus bedrijf lokaal slots', // Include slots and lokaal
        populate: {
          path: 'bedrijf',
          select: 'name sector',
        }
      })
      .sort({ createdAt: 1 });

    const formattedAfspraken = afspraken.map(afspraak => {
      const selectedSlot = afspraak.speeddate?.slots.id(afspraak.slot); // Find the specific slot
      const slotTime = selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : 'N/B';
      const slotLokaal = afspraak.speeddate?.lokaal || 'N/B';

      return {
        _id: afspraak._id,
        speeddateId: afspraak.speeddate?._id,
        slotId: afspraak.slot,
        bedrijfNaam: afspraak.speeddate?.bedrijf?.name || 'Onbekend Bedrijf',
        sector: afspraak.speeddate?.bedrijf?.sector || 'N/B',
        focus: afspraak.speeddate?.focus,
        tijd: slotTime, // Use specific slot time
        lokaal: slotLokaal, // Use main speeddate lokaal
      };
    });

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
  countPendingAanvragen,
  getAllPendingAanvragen,
};