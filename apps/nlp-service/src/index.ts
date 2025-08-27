import express from 'express';

const app = express();
const PORT = process.env.NLP_SERVICE_PORT || 3002;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'nlp-service' });
});

// Placeholder routes
app.get('/', (req, res) => {
  res.json({ message: 'AI Creative Studio NLP Service' });
});

app.listen(PORT, () => {
  console.log(`NLP Service running on port ${PORT}`);
});