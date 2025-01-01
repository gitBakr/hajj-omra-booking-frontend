const pelerinSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
    // S'assurer qu'il n'y a pas de valeur par défaut ici
  },
  // ... autres champs
}); 