import express from 'express';

const app = express();

app.get('/api', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});