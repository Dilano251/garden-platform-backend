const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.post('/log', async (req, res) => {
  const { learnerId, day, plantName, heightCm, notes } = req.body;
  if (!learnerId || !day) {
    return res.status(400).json({ error: 'learnerId and day are required' });
  }
  const { data, error } = await supabase.from('growth_log').upsert(
    [{ learner_id: learnerId, day, plant_name: plantName || '', height_cm: heightCm || null, notes: notes || '' }],
    { onConflict: 'learner_id,day' }
  ).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/:learnerId', async (req, res) => {
  const { data, error } = await supabase.from('growth_log').select('*').eq('learner_id', req.params.learnerId).order('day', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
