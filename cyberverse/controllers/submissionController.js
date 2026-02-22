const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');
const User = require('../models/User');
const Leaderboard = require('../models/Leaderboard');
const { sendSuccess, sendError } = require('../utils/response');

// Award badges based on milestones
const checkAndAwardBadges = async (user, newPoints) => {
  const badges = [];
  const milestones = [
    { points: 100, name: 'Rookie Hacker', icon: '🟢', description: 'Earned 100 points' },
    { points: 500, name: 'Script Kiddie', icon: '🔵', description: 'Earned 500 points' },
    { points: 1000, name: 'CTF Warrior', icon: '🟣', description: 'Earned 1000 points' },
    { points: 5000, name: 'Elite Hacker', icon: '🔴', description: 'Earned 5000 points' },
  ];

  for (const milestone of milestones) {
    const alreadyHas = user.badges.some((b) => b.name === milestone.name);
    if (!alreadyHas && newPoints >= milestone.points) {
      badges.push({ name: milestone.name, description: milestone.description, icon: milestone.icon });
    }
  }

  return badges;
};

// Recalculate and update leaderboard ranks
const updateLeaderboardRanks = async () => {
  const entries = await Leaderboard.find().sort({ total_points: -1 });
  const bulkOps = entries.map((entry, index) => ({
    updateOne: {
      filter: { _id: entry._id },
      update: { rank: index + 1 },
    },
  }));
  if (bulkOps.length > 0) await Leaderboard.bulkWrite(bulkOps);
};

// @desc    Submit a flag for a challenge
// @route   POST /api/submit-flag
// @access  Private
exports.submitFlag = async (req, res, next) => {
  try {
    const { challenge_id, submitted_flag } = req.body;
    const userId = req.user._id;

    // Fetch challenge with flag
    const challenge = await Challenge.findById(challenge_id).select('+flag');
    if (!challenge || !challenge.isActive) return sendError(res, 404, 'Challenge not found');

    // Check if already solved correctly by this user
    const alreadySolved = await Submission.findOne({ user_id: userId, challenge_id, isCorrect: true });
    if (alreadySolved) {
      return sendError(res, 409, 'You have already solved this challenge!');
    }

    const isCorrect = challenge.flag.trim() === submitted_flag.trim();

    // Save submission (correct or wrong)
    await Submission.create({
      user_id: userId,
      challenge_id,
      submitted_flag,
      isCorrect,
      points_awarded: isCorrect ? challenge.points : 0,
      ip_address: req.ip,
    });

    if (!isCorrect) {
      return sendError(res, 400, 'Wrong flag! Keep trying.');
    }

    // Update user: add points, mark challenge complete
    const user = await User.findById(userId);
    const newTotalPoints = user.totalPoints + challenge.points;

    const newBadges = await checkAndAwardBadges(user, newTotalPoints);

    await User.findByIdAndUpdate(userId, {
      $push: { completedChallenges: challenge_id, badges: { $each: newBadges } },
      $inc: { totalPoints: challenge.points },
    });

    // Update challenge solve count
    await Challenge.findByIdAndUpdate(challenge_id, {
      $push: { solvedBy: userId },
      $inc: { solveCount: 1 },
    });

    // Update leaderboard
    await Leaderboard.findOneAndUpdate(
      { user_id: userId },
      {
        $inc: { total_points: challenge.points, challenges_solved: 1 },
        username: user.username,
        college_name: user.college_name,
      },
      { upsert: true, new: true }
    );

    // Recalculate ranks
    await updateLeaderboardRanks();

    return sendSuccess(res, 200, '🎉 Correct flag! Points awarded.', {
      points_awarded: challenge.points,
      new_total_points: newTotalPoints,
      new_badges: newBadges,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's submission history
// @route   GET /api/submissions
// @access  Private
exports.getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ user_id: req.user._id })
      .populate('challenge_id', 'title difficulty points type')
      .sort({ createdAt: -1 })
      .limit(50);

    return sendSuccess(res, 200, 'Submissions fetched', { submissions });
  } catch (error) {
    next(error);
  }
};
