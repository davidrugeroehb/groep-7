# Career Match
## groep-7

Career Match is een webapplicatie ontworpen om studenten en bedrijven eenvoudig met elkaar te matchen via speeddates. Het platform werd ontwikkeld als onderdeel van het Programming Project aan de Erasmushogeschool Brussel.


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

---

© 2025 Career Match – Programming Project – Erasmushogeschool Brussel

## 🔧 Installatie-instructies

Deze gids helpt je om dit project lokaal op te zetten en te draaien.

### Vereisten

Zorg ervoor dat je de volgende software op je systeem hebt geïnstalleerd:

* **Node.js (versie 18 of hoger aanbevolen):** Inclusief `npm` (Node Package Manager).
    * Controleer of Node.js en npm al zijn geïnstalleerd door de volgende commando's uit te voeren in je terminal:
        ```bash
        node -v
        npm -v
        ```
    * Als ze niet zijn geïnstalleerd, download en installeer de aanbevolen LTS-versie van [nodejs.org](https://nodejs.org/en/download/).
* **MongoDB:** Zorg ervoor dat MongoDB lokaal draait of dat je een verbinding hebt met een MongoDB-database (bijvoorbeeld via MongoDB Atlas).
* **Code-editor:** Een code-editor zoals [VS Code](https://code.visualstudio.com/) wordt aanbevolen.

### Eerste Setup (Belangrijk voor Windows-gebruikers)

#### PowerShell Uitvoeringsbeleid

Als je Windows gebruikt en je krijgt een foutmelding over scriptuitvoering (bijvoorbeeld bij `npm`), moet je mogelijk het uitvoeringsbeleid van PowerShell aanpassen.

1.  Open **PowerShell als Administrator**.
2.  Voer het volgende commando uit:
    ```powershell
    Set-ExecutionPolicy RemoteSigned
    ```
3.  Typ `Y` en druk op Enter om te bevestigen.
4.  Sluit de Administrator PowerShell en open een **nieuwe, reguliere terminal** (of herstart VS Code) voordat je verdergaat.

### Installatie & Starten van het Project

**Belangrijk:** Open een **nieuwe terminal** (of herstart VS Code) nadat je Node.js hebt geïnstalleerd en/of het PowerShell uitvoeringsbeleid hebt aangepast.


1.  **Backend installeren en starten**
    Navigeer naar de `backend` map:
    ```bash
    cd backend
    ```
    Installeer de benodigde packages voor de backend:
    ```bash
    npm install
    ```
    Installeer `nodemon` (een tool die de server automatisch herstart bij wijzigingen) als een ontwikkelafhankelijkheid:
    ```bash
    npm install nodemon --save-dev
    ```
    Start de backend server:
    ```bash
    npm run server
    ```
    De backend zal nu draaien (standaard op `http://localhost:4000`).

2.  **Frontend installeren en starten**
    Open een **tweede terminalvenster** en navigeer naar de `frontend` map:
    ```bash
    cd ../frontend
    ```
    Installeer de benodigde packages voor de frontend:
    ```bash
    npm install
    ```
    Start de frontend ontwikkelserver:
    ```bash
    npm run dev
    ```
    De frontend applicatie zal nu starten en automatisch openen in je browser (standaard op `http://localhost:5173`).

---

## Testaccounts

### Student

-   **Email**: `sarah.janssen@student.ehb.be`


### Bedrijf
-   **Email**: `ines.dumont@brightvision.be`
-   **Wachtwoord**: `ines123`
-   **Email**: `tom.vermeulen@codecrafters.be`
-   **Wachtwoord**: `tom123`
-   **Email**: `emma.claes@netsecure.be `
-   **Wachtwoord**: `emma123`
-   **Email**: `jonas.debruyn@quantumsoft.be  `
-   **Wachtwoord**: `jonas123`
-   **Email**: `sarah.michiels@cloudnova.be   `
-   **Wachtwoord**: `sarah123`

### Admin
-   **Email**: `admin@ehb.be`
-   **Wachtwoord**: `admin123`
