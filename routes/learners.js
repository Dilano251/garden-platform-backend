const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const { v4: uuidv4 } = require('uuid');

router.post('/register', async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const { data, error } = await supabase
    .from('learners')
    .insert([{ id: uuidv4(), name: name.trim(), xp: 0 }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('learners')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Learner not found' });
  res.json(data);
});

module.exports = router;
