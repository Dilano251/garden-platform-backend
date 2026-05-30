const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.post('/award', async (req, res) => {
  const { learnerId, badgeSlug, badgeName } = req.body;
  if (!learnerId || !badgeSlug) {
    return res.status(400).json({ error: 'learnerId and badgeSlug are required' });
  }
  const { data: existing } = await supabase.from('badges').select('id').eq('learner_id', learnerId).eq('badge_slug', badgeSlug).single();
  if (existing) return res.json({ alreadyEarned: true });
  const { data, error } = await supabase.from('badges').insert([{ learner_id: learnerId, badge_slug: badgeSlug, badge_name: badgeName || badgeSlug }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ awarded: true, badge: data });
});

router.get('/:learnerId', async (req, res) => {
  const { data, error } = await supabase.from('badges').select('*').eq('learner_id', req.params.learnerId).order('earned_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
