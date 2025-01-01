const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'votre-email@gmail.com',
    pass: 'votre-mot-de-passe-app' // Utiliser un mot de passe d'application Google
  }
});

const sendConfirmationEmail = async (userEmail, reservationDetails) => {
  const mailOptions = {
    from: 'votre-email@gmail.com',
    to: userEmail,
    subject: 'Confirmation de votre réservation Hajj/Omra',
    html: `
      <h1>Confirmation de votre réservation</h1>
      <p>Cher(e) pèlerin(e),</p>
      <p>Nous avons bien reçu votre réservation pour le ${reservationDetails.typePelerinage}.</p>
      <p>Détails de votre réservation :</p>
      <ul>
        <li>Type : ${reservationDetails.typePelerinage}</li>
        <li>Date de départ : ${reservationDetails.dateDepart}</li>
        <li>Nombre de personnes : ${reservationDetails.nombrePersonnes}</li>
      </ul>
      <p>Vous pouvez consulter vos réservations à tout moment avec votre email.</p>
      <p>Cordialement,<br>L'équipe Hajj/Omra</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✉️ Email de confirmation envoyé');
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};

module.exports = { sendConfirmationEmail }; 