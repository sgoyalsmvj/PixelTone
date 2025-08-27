import express from 'express';

const app = express();
const PORT = process.env.GENERATION_SERVICE_PORT || 3003;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'generation-service' });
});

// Placeholder routes
app.get('/', (req, res) => {
    res.json({ message: 'AI Creative Studio Generation Service' });
});

app.listen(PORT, () => {
    console.log(`Generation Service running on port ${PORT}`);
});