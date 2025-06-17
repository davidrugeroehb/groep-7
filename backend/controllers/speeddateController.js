// backend/controllers/speeddateController.js
import Speeddate from '../models/speeddateModel.js';
import Bedrijf from '../models/bedrijfModel.js';
import Aanvraag from '../models/aanvraagModel.js';
import Lokaal from '../models/lokaalModel.js'; // NIEUW: Importeer Lokaal model

// Simuleer globale instellingen voor de speeddate dag (moet later uit een database komen)
// Voor nu hardcoded, later op te halen uit een Admin Instellingen Model
const GLOBAL_SPEEDDATE_DAY_START = "09:00"; // Bijv. 9 AM
const GLOBAL_SPEEDDATE_DAY_END = "17:00";   // Bijv. 5 PM

// Helper functie om tijdstrings te parsen naar Date objecten voor vergelijking
const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
};

// Functie om een nieuwe speeddate aan te maken met individuele slots
const createSpeeddate = async (req, res) => {
  try {
    const {
      bedrijfId,
      starttijd, // Overall period start time (e.g., 13:00)
      eindtijd,   // Overall period end time (e.g., 14:00)
      lokaalId,   // NIEUW: ID van het geselecteerde lokaal
      vakgebied,
      focus,
      opportuniteit,
      talen,
      beschrijving,
      speeddateSlots, // Array of pre-calculated slots from frontend
    } = req.body;

    if (!bedrijfId || !starttijd || !eindtijd || !lokaalId || !vakgebied || !focus || !opportuniteit || !talen || !beschrijving || !speeddateSlots || speeddateSlots.length === 0) {
      return res.status(400).json({ message: 'Alle velden inclusief ten minste één speeddate slot en een lokaal zijn verplicht.' });
    }

    // 1. Controleer of bedrijf bestaat
    const bedrijf = await Bedrijf.findById(bedrijfId);
    if (!bedrijf) {
      return res.status(404).json({ message: 'Bedrijf niet gevonden.' });
    }

    // 2. Controleer of lokaal bestaat en haal capaciteit op
    const lokaal = await Lokaal.findById(lokaalId);
    if (!lokaal) {
      return res.status(404).json({ message: 'Geselecteerd lokaal niet gevonden.' });
    }

    // 3. Valideer speeddate periode binnen globale dagtijden
    const overallStart = parseTime(starttijd);
    const overallEnd = parseTime(eindtijd);
    const globalDayStart = parseTime(GLOBAL_SPEEDDATE_DAY_START);
    const globalDayEnd = parseTime(GLOBAL_SPEEDDATE_DAY_END);

    if (overallStart < globalDayStart || overallEnd > globalDayEnd || overallStart >= overallEnd) {
        return res.status(400).json({
            message: `De totale speeddate periode moet liggen tussen ${GLOBAL_SPEEDDATE_DAY_START} en ${GLOBAL_SPEEDDATE_DAY_END}.`
        });
    }

    // 4. Controleer lokaal beschikbaarheid en capaciteit voor ELK slot
    for (const newSlot of speeddateSlots) {
        const newSlotStart = parseTime(newSlot.startTime);
        const newSlotEnd = parseTime(newSlot.endTime);

        // Filter bestaande bezette slots in dit lokaal die overlappen met het nieuwe slot
        const overlappingOccupiedSlots = lokaal.occupiedSlots.filter(occupied => {
            const occupiedStart = parseTime(occupied.startTime);
            const occupiedEnd = parseTime(occupied.endTime);

            // Overlap check: [start1, end1] overlapt met [start2, end2] als start1 < end2 en end1 > start2
            return (newSlotStart < occupiedEnd && newSlotEnd > occupiedStart);
        });

        // Controleer de capaciteit
        if (overlappingOccupiedSlots.length >= lokaal.capacity) {
            return res.status(400).json({
                message: `Lokaal '${lokaal.name}' is niet beschikbaar of heeft onvoldoende capaciteit voor het tijdslot ${newSlot.startTime} - ${newSlot.endTime}.`
            });
        }
    }


    // 5. Maak de nieuwe speeddate aan
    const newSpeeddate = new Speeddate({
      bedrijf: bedrijfId,
      starttijd,
      eindtijd,
      lokaal: lokaalId, // Gebruik nu de lokaal ID
      vakgebied,
      focus,
      opportuniteit,
      talen,
      beschrijving,
      slots: speeddateSlots,
    });

    const savedSpeeddate = await newSpeeddate.save();

    // 6. Werk de occupiedSlots van het lokaal bij
    // Voor elke slot in de nieuw aangemaakte speeddate, voeg deze toe aan de occupiedSlots van het lokaal
    // We slaan de speeddateId en de slotId op om later te kunnen verwijzen (voor annulering/verwijdering)
    for (const slot of savedSpeeddate.slots) {
        lokaal.occupiedSlots.push({
            speeddateId: savedSpeeddate._id,
            startTime: slot.startTime,
            endTime: slot.endTime,
            slotId: slot._id, // Voeg de specifieke _id van het sub-slot toe
            // studentId is hier nog null, wordt pas gevuld bij aanvraag/bevestiging
        });
    }
    await lokaal.save(); // Sla de bijgewerkte lokaal op

    res.status(201).json({
      message: 'Speeddate succesvol aangemaakt met individuele slots en lokaal gereserveerd!',
      speeddate: savedSpeeddate,
    });
  } catch (error) {
    console.error('Fout bij het aanmaken van speeddate:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het aanmaken van de speeddate.',
      error: error.message,
    });
  }
};

// Functie om alle speeddates op te halen (voor studentenoverzicht - Speeddates.jsx)
// Populeert ook de bedrijfsnaam, lokaalnaam en alle slots
const getAllSpeeddates = async (req, res) => {
  try {
    const speeddates = await Speeddate.find({})
      .populate({
        path: 'bedrijf',
        select: 'name', // Only retrieve the name of the company
      })
      .populate({ // NIEUW: Populeer het lokaal object om de naam te krijgen
        path: 'lokaal',
        select: 'name', // Haal alleen de naam van het lokaal op
      })
      .sort({ starttijd: 1 }); // Sort by overall start time for consistency

    const availableSpeeddates = speeddates.filter(sd => sd.slots.some(slot => slot.status === 'open'));

    res.status(200).json({ speeddates: availableSpeeddates });
  } catch (error) {
    console.error('Fout bij het ophalen van alle speeddates:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het ophalen van de speeddates.',
      error: error.message,
    });
  }
};

// Functie om speeddates op te halen voor een specifiek bedrijf (voor bedrijf Home.jsx)
const getCompanySpeeddates = async (req, res) => {
  try {
    const { bedrijfId } = req.params;

    if (!bedrijfId) {
      return res.status(400).json({ message: 'Bedrijf ID is vereist.' });
    }

    const speeddates = await Speeddate.find({ bedrijf: bedrijfId })
      .populate({
        path: 'bedrijf',
        select: 'name', // Only retrieve the name of the company
      })
      .populate({ // Populeer student details binnen slots voor bedrijfsoverzicht
        path: 'slots.student',
        select: 'voornaam achternaam',
      })
      .populate({ // NIEUW: Populeer het lokaal object om de naam te krijgen
        path: 'lokaal',
        select: 'name', // Haal alleen de naam van het lokaal op
      })
      .sort({ createdAt: -1 }); // Sort by creation date or overall start time

    res.status(200).json({ speeddates });
  } catch (error) {
    console.error('Fout bij het ophalen van speeddates voor bedrijf:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het ophalen van speeddates voor dit bedrijf.',
      error: error.message,
    });
  }
};

// Functie om een speeddate te verwijderen (inclusief alle gekoppelde aanvragen voor de slots)
const deleteSpeeddate = async (req, res) => {
  try {
    const { speeddateId } = req.params;

    const speeddate = await Speeddate.findById(speeddateId);
    if (!speeddate) {
      return res.status(404).json({ message: 'Speeddate niet gevonden.' });
    }

    // Haal het bijbehorende lokaal op om occupiedSlots bij te werken
    const lokaal = await Lokaal.findById(speeddate.lokaal);

    // Verwijder gerelateerde aanvragen
    await Aanvraag.deleteMany({ speeddate: speeddateId });

    // Verwijder de speeddate zelf
    await Speeddate.findByIdAndDelete(speeddateId);

    // NIEUW: Verwijder de bezette slots uit het lokaal
    if (lokaal) {
        // Filter de occupiedSlots die van deze speeddate zijn
        lokaal.occupiedSlots = lokaal.occupiedSlots.filter(
            slot => slot.speeddateId.toString() !== speeddateId
        );
        await lokaal.save();
    }


    res.status(200).json({ message: 'Speeddate en alle gekoppelde aanvragen succesvol verwijderd, lokaal vrijgegeven.' });
  } catch (error) {
    console.error('Fout bij het verwijderen van speeddate:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het verwijderen van de speeddate.',
      error: error.message,
    });
  }
};

// Functie om alle speeddates op te tellen (voor admin dashboard)
const countAllSpeeddates = async (req, res) => {
  try {
    const count = await Speeddate.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Fout bij het tellen van speeddates:', error);
    res.status(500).json({ message: 'Er ging iets mis bij het tellen van speeddates.', error: error.message });
  }
};


export {
  createSpeeddate,
  getAllSpeeddates,
  getCompanySpeeddates,
  deleteSpeeddate,
  countAllSpeeddates,
};