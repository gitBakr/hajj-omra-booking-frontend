const { sendConfirmationEmail } = require('../config/email');

// Dans la fonction de création de pèlerin
exports.createPelerin = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      nationalite,
      telephone,
      email,
      adresse,
      typePelerinage,
      besoinsSpeciaux
    } = req.body;

    console.log('📝 Nouvelle réservation:', {
      email,
      nom,
      prenom,
      typePelerinage
    });

    // Vérifier le nombre total avant création
    const countBefore = await Pelerin.countDocuments();
    console.log('📊 Nombre de réservations avant:', countBefore);

    // Vérifier si le pèlerin existe déjà avec le même email
    const pelerinExistant = await Pelerin.findOne({ 
      email: email  // Vérifier uniquement l'email
    });

    if (pelerinExistant) {
      return res.status(400).json({
        success: false,
        message: `Un compte existe déjà avec l'email ${email}. ` +
                `Pour plus d'informations, appelez le 07 83 09 08 15 ou vérifiez vos réservations.`
      });
    }

    const pelerin = await Pelerin.create({
      nom,
      prenom,
      nationalite,
      telephone,
      email,
      adresse,
      typePelerinage,
      besoinsSpeciaux
    });

    // Vérifier le nombre total après création
    const countAfter = await Pelerin.countDocuments();
    console.log('📊 Nombre de réservations après:', countAfter);
    console.log('✅ Réservation créée:', {
      id: pelerin._id,
      email: pelerin.email,
      date: pelerin.dateInscription
    });

    res.status(201).json({
      success: true,
      data: pelerin,
      message: 'Inscription réussie'
    });

  } catch (error) {
    console.error('❌ Erreur création:', error);
    res.status(400).json({
      success: false,
      message: `Erreur lors de l'inscription. Veuillez réessayer.`
    });
  }
};

// Ajouter une nouvelle fonction pour les statistiques admin
exports.getAdminStats = async (req, res) => {
  try {
    const stats = {
      total: await Pelerin.countDocuments(),
      hajj: await Pelerin.countDocuments({ typePelerinage: 'hajj' }),
      omra: await Pelerin.countDocuments({ typePelerinage: 'omra' }),
      reservations: await Pelerin.find({})
        .sort({ dateInscription: -1 })
        .lean()
        .select('email nom prenom typePelerinage dateInscription')
    };

    console.log('📊 Statistiques admin:', {
      total: stats.total,
      hajj: stats.hajj,
      omra: stats.omra,
      emails: stats.reservations.map(r => r.email)
    });

    res.json(stats);
  } catch (error) {
    console.error('❌ Erreur stats admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des statistiques' 
    });
  }
};

// Modifier la fonction searchPelerin
exports.searchPelerin = async (req, res) => {
  try {
    const { email } = req.query;
    console.log('🔍 Recherche pour email:', email);

    // Si c'est l'admin, retourner toutes les réservations avec plus de détails
    if (email === 'raouanedev@gmail.com') {
      console.log('👑 Recherche admin');
      
      // Vérifier le nombre total
      const totalCount = await Pelerin.countDocuments();
      console.log('📊 Nombre total en base:', totalCount);

      // Récupérer toutes les réservations
      const reservations = await Pelerin.find({})
        .sort({ dateInscription: -1 })
        .lean();

      console.log('📝 Détails des réservations:', reservations.map(r => ({
        id: r._id,
        email: r.email,
        date: r.dateInscription
      })));

      return res.json(reservations);
    }

    // Pour les clients normaux
    const reservations = await Pelerin.find({ email })
      .sort({ dateInscription: -1 })
      .lean();

    console.log(`📦 Réservations client (${email}):`, reservations.length);
    res.json(reservations);

  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
};

// Ajouter une route admin dédiée
exports.adminListPelerins = async (req, res) => {
  try {
    const { email } = req.body;

    // Vérifier que c'est bien l'admin
    if (email !== 'raouanedev@gmail.com') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    console.log('👑 Accès admin - Liste complète');

    // Compter le total
    const totalCount = await Pelerin.countDocuments();
    console.log('📊 Nombre total de pèlerins:', totalCount);

    // Récupérer toutes les réservations avec tri
    const pelerins = await Pelerin.find({})
      .sort({ dateInscription: -1 })
      .lean();

    // Logs détaillés
    console.log('📝 Détails des réservations:');
    pelerins.forEach((p, index) => {
      console.log(`${index + 1}. ${p.email} - ${p.nom} ${p.prenom} (${p.dateInscription})`);
    });

    // Statistiques
    const stats = {
      total: totalCount,
      hajj: pelerins.filter(p => p.typePelerinage === 'hajj').length,
      omra: pelerins.filter(p => p.typePelerinage === 'omra').length
    };

    console.log('📊 Statistiques:', stats);

    res.json({
      success: true,
      stats,
      pelerins
    });

  } catch (error) {
    console.error('❌ Erreur admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des données'
    });
  }
}; 