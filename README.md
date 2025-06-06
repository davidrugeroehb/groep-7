# Career Match 🎯
## groep-7

Career Match is een webapplicatie ontworpen om studenten en bedrijven eenvoudig met elkaar te matchen via speeddates. Het platform werd ontwikkeld als onderdeel van het Programming Project aan de Erasmushogeschool Brussel.

## Features

### Gebruikersrollen
- **Student**
  - Login
  - Aanvragen beheren
  - Geplande speeddates bekijken

- **Bedrijf**
  - Signup & Login
  - Studenten zoeken
  - Speeddates beheren
  - Aanvragen ontvangen en behandelen
  - Profiel beheren

- **Admin** (toekomstige uitbreiding)

### Authenticatie
- Gescheiden login voor studenten, bedrijven en admins
- Signup mogelijk voor bedrijven via een dedicated formulier
- JWT-authenticatie in ontwikkeling

### Pagina's
| Pagina                        | Beschrijving                          |
|-------------------------------|---------------------------------------|
| `/login`                      | Loginpagina voor alle gebruikers      |
| `/bedrijf/signup`             | Bedrijf registratieformulier          |
| `/bedrijf/geplandeSpeeddates` | Lijst met geplande speeddates         |
| `/bedrijf/aanvragen`          | Inkomende aanvragen                   |
| `/bedrijf/studentenZoeken`    | Zoekpagina voor studenten             |
| `/bedrijf/bedrijfProfiel`     | Profielpagina van het bedrijf         |
| `/about`                      | Algemene info over Career Match       |

## Technologieën

### Frontend
- React (Vite)
- TailwindCSS
- React Router DOM
- Custom components

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- Nodemon voor live reload

## Installatiehandleiding

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run server
```

> ⚠ Zorg ervoor dat je `.env` bestand bevat:
```
DATABASE_URL=mongodb://localhost:27017/career-match
PORT=4000
```

## MongoDB Schema (Bedrijf)
```js
const bedrijfSchema = new mongoose.Schema({
  name: String,
  adres: String,
  btwNummer: String,
  website: String,
  sector: String,
  contactpersoon: String,
  email: { type: String, unique: true },
  password: String,
  phone: String
});
```

---

© 2025 Career Match – Programming Project – Erasmushogeschool Brussel

## 🔧 Installatie-instructies

### Vereisten
- Node.js en npm
- MongoDB account (optioneel, wordt momenteel niet gebruikt)
- Code-editor zoals VS Code

### Installatie & Starten

1. **Clonen van de repository**
```bash
git clone <repo-url>
cd groep-7
```

2. **Frontend installeren en starten**
```bash
cd frontend
npm install
npm run dev
```

3. **Backend installeren en starten**
```bash
cd ../backend
npm install
npm run server
```

De frontend draait normaal op `http://localhost:5173` en de backend op `http://localhost:4000`.

---

## Testaccounts

### Bedrijf
- **Email**: `sarah.jacobs@nextwaveit.be`
- **Wachtwoord**: `sara123`

### Admin 
Momenteel niet beschikbaar 

### Student
- **Email**: `student@mail.com`
- **Wachtwoord**: `student123`