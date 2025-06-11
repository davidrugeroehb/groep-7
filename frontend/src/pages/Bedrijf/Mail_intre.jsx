import React, { useEffect, useState } from "react";
 
function MailIntresse() {
  const inhoudMail=document.getElementById("inhoud").value
  function sendEmail() {
            Email.send({
                Host: "smtp.yourisp.com",
                Username: "username",
                Password: "password",
                To: 'recipient@example.com', //mail van de bedrijf
                From: "sender@example.com", //mail van de student
                Subject: "Career launch intresse",
                Body: inhoudMail
            })
            .then(function (message) {
                alert("Mail sent successfully") // Alert message on successful email delivery
            });
        }

  return (     
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form className="bg-white p-8 rounded shadow-md w-full max-w-md" method="post">
            <p>Mailadres</p> <br></br>
            <input type="email" required></input><br></br>
            <p>inhoud</p><br></br>
            <textarea id="inhoud" name="mail" rows="10" cols="50" required></textarea><br></br>
            <button type="submit"  className="bg-blue-500 text-white w-full py-2 rounded-md text-base hover:bg-blue-600 transition">Verzend</button>
        </form>
    </div>
  );
}


export default MailIntresse;