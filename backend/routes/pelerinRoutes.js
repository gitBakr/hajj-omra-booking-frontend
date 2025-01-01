const express = require('express');
const router = express.Router();
const pelerinController = require('../controllers/pelerinController');

// Routes existantes
router.post('/', pelerinController.createPelerin);
router.get('/search', pelerinController.searchPelerin);

// Route admin
router.post('/admin/list', pelerinController.adminListPelerins);

module.exports = router; 