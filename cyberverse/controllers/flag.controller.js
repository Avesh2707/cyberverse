const Challenge = require('../models/Challenge.model');
const Submission = require('../models/Submission.model');
const User = require('../models/User.model');
const Leaderboard = require('../models/Leaderboard.model');
const { asyncHandler, AppError } = require('../middleware/error.middleware');

const BADGES = [
  { threshold: 1, name: 'First Blood', description: 'Solved your first challenge', icon: '🩸' },
  { threshold: 10, name: 'Hacker', description: 'Solved 10 challenges', icon: '💻' },
  { threshold: 25, name: 'Elite', description: 'Solved 25 challenges', icon: '⚡' },
  { threshold: 50, name: 'Legend', description: 'Solved 50 challenges', icon: '🏆' },
];

/**
 * @desc    Submit a flag for a challenge
 * @route   POST /api/submit-flag
 * @access  Private
 */
const submitFlag = asyncHandler(async (req, res) => {
  const { challenge_id, submitted_flag } = req.body;

  const challenge = await Challenge.findById(challenge_id).select('+flag');
  if (!challenge || !challenge.isActive) throw new AppError('Challenge not found', 404);

  // Prevent duplicate correct submissions
  const alreadySolved = challenge.solvedBy.includes(req.user._id);
  if (alreadySolved) {
    return res.status(400).json({ success: false, message: 'You have already solved this challenge!' });
  }

  // Count previous attempts
  const attemptCount = await Submission.countDocuments({ user_id: req.user._id, challenge_id });

  const isCorrect = submitted_flag.trim() === challenge.flag.trim();

  const submission = await Submission.create({
    user_id: req.user._id,
    challenge_id,
    submitted_flag,
    is_correct: isCorrect,
    points_earned: isCorrect ? challenge.points : 0,
    attempt_number: attemptCount + 1,
    ip_address: req.ip,
  });

  if (!isCorrect) {
    return res.status(400).json({
      success: false,
      message: '❌ Incorrect flag. Keep trying!',
      attempts: attemptCount + 1,
    });
  }

  // Award points, mark solved
  const user = await User.findById(req.user._id);
  user.totalPoints += challenge.points;
  user.completedChallenges.push(challenge._id);

  // Check for new badges
  const newBadges = [];
  const solvedCount = user.completedChallenges.length;
  for (const badge of BADGES) {
    if (solvedCount === badge.threshold) {
      const alreadyHas = user.badges.some((b) => b.name === badge.name);
      if (!alreadyHas) {
        user.badges.push({ name: badge.name, description: badge.description, icon: badge.icon });
        newBadges.push(badge);
      }
    }
  }

  await user.save();

  // Update challenge solve count
  await Challenge.findByIdAndUpdate(challenge_id, {
    $push: { solvedBy: req.user._id },
    $inc: { solveCount: 1 },
  });

  // Update leaderboard (only for compete challenges)
  if (challenge.type === 'compete') {
    await Leaderboard.findOneAndUpdate(
      { user_id: req.user._id },
      {
        $inc: { total_points: challenge.points, challenges_solved: 1 },
        $set: { username: user.username, college_name: user.college_name, last_submission: new Date() },
      },
      { upsert: true, new: true }
    );
    // Recalculate ranks (could be queued in production)
    await Leaderboard.recalculateRanks();
  }

  res.json({
    success: true,
    message: `🎉 Correct flag! You earned ${challenge.points} points!`,
    data: {
      points_earned: challenge.points,
      total_points: user.totalPoints,
      challenges_solved: user.completedChallenges.length,
      new_badges: newBadges,
    },
  });
});

module.exports = { submitFlag };
