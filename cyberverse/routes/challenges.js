const express = require('express');
const router = express.Router();
const {
  getPracticeChallenges,
  getCompeteChallenges,
  getChallengeById,
  searchChallenges,
} = require('../controllers/challengeController');
const { protect } = require('../middleware/auth');

router.get('/search', protect, searchChallenges);
router.get('/practice', protect, getPracticeChallenges);
router.get('/compete', protect, getCompeteChallenges);
router.get('/:id', protect, getChallengeById);

module.exports = router;
