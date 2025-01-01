const { sendConfirmationEmail } = require('../config/email');

// Dans la fonction de création de pèlerin
exports.createPelerin = async (req, res) => {
  try {
    const pelerin = await Pelerin.create(req.body);
    
    // Envoyer l'email de confirmation
    await sendConfirmationEmail(pelerin.email, {
      typePelerinage: pelerin.typePelerinage,
      dateDepart: pelerin.dateDepart,
      nombrePersonnes: 1
    });

    res.status(201).json(pelerin);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: error.message });
  }
}; 