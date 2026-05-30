const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.post('/award', async (req, res) => {
  const { learnerId, amount, reason } = req.body;
  if (!learnerId || !amount) {
    return res.status(400).json({ error: 'learnerId and amount are required' });
  }
  await supabase.from('xp_events').insert([{ learner_id: learnerId, amount, reason: reason || '' }]);
  const { data: learner } = await supabase.from('learners').select('xp').eq('id', learnerId).single();
  const newXP = (learner?.xp || 0) + amount;
  const { data, error } = await supabase.from('learners').update({ xp: newXP }).eq('id', learnerId).select('xp').single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ xp: data.xp });
});

router.get('/:learnerId', async (req, res) => {
  const { data, error } = await supabase.from('xp_events').select('*').eq('learner_id', req.params.learnerId).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
