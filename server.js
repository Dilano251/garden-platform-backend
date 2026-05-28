require('dotenv').config();
const express = require('express');
const cors = require('cors');

const learnersRouter = require('./routes/learners');
const xpRouter = require('./routes/xp');
const badgesRouter = require('./routes/badges');
const growthRouter = require('./routes/growth');
const questionsRouter = require('./routes/questions');
const teacherRouter = require('./routes/teacher');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'Garden Platform API running' }));

app.use('/api/learners', learnersRouter);
app.use('/api/xp', xpRouter);
app.use('/api/badges', badgesRouter);
app.use('/api/growth', growthRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/teacher', teacherRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
