import React, { useEffect, useState } from "react";
 
function MailIntresse() {

  return (
     
    <div>
        <form>
            <p>Mailadres</p>
            <input type="email" required></input>
            <p>inhoud</p>
            <textarea id="inhoud" name="mail" rows="10" cols="50" required></textarea>
            <button type="submit">Verzend</button>
        </form>
    </div>
  );
}


export default MailIntresse;