const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.post('/login', (req, res) => {
  const { pin } = req.body;
  if (pin === process.env.TEACHER_PIN) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Incorrect PIN' });
  }
});

router.get('/overview', async (req, res) => {
  const { data: learners, error } = await supabase.from('learners').select('id, name, xp, created_at').order('xp', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });

  const enriched = await Promise.all(learners.map(async (learner) => {
    const [badges, growth, questions] = await Promise.all([
      supabase.from('badges').select('badge_slug, badge_name, earned_at').eq('learner_id', learner.id),
      supabase.from('growth_log').select('day, plant_name, height_cm, notes').eq('learner_id', learner.id).order('day'),
      supabase.from('questions').select('question, answer, created_at').eq('learner_id', learner.id).order('created_at', { ascending: false }).limit(20),
    ]);
    return {
      ...learner,
      badges: badges.data || [],
      badgeCount: (badges.data || []).length,
      growthLog: growth.data || [],
      growthDays: (growth.data || []).length,
      questions: questions.data || [],
      questionCount: (questions.data || []).length,
    };
  }));

  res.json(enriched);
});

module.exports = router;
