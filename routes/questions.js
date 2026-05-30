const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.post('/log', async (req, res) => {
  const { learnerId, question, answer } = req.body;
  if (!learnerId || !question) {
    return res.status(400).json({ error: 'learnerId and question are required' });
  }
  const { data, error } = await supabase.from('questions').insert([{ learner_id: learnerId, question, answer: answer || '' }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/:learnerId', async (req, res) => {
  const { data, error } = await supabase.from('questions').select('*').eq('learner_id', req.params.learnerId).order('created_at', { ascending: false }).limit(50);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
