import express from 'express';
import { NLPService } from './services/nlpService';
import { NLPInputSchema, ParsedParametersSchema } from '@ai-studio/shared-types';

const app = express();
const PORT = process.env.NLP_SERVICE_PORT || 3002;
const nlpService = new NLPService();

app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'nlp-service' });
});

// Main route
app.get('/', (_req, res) => {
  res.json({ message: 'AI Creative Studio NLP Service' });
});

// Parse creative input
app.post('/parse', async (req, res) => {
  try {
    const validatedInput = NLPInputSchema.parse(req.body);
    const result = await nlpService.parseCreativeInput(validatedInput);
    res.json(result);
  } catch (error) {
    console.error('Parse error:', error);
    res.status(400).json({ 
      error: 'Invalid input', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Validate parameters
app.post('/validate', async (req, res) => {
  try {
    const validatedParams = ParsedParametersSchema.parse(req.body);
    const result = await nlpService.validateParameters(validatedParams);
    res.json(result);
  } catch (error) {
    console.error('Validation error:', error);
    res.status(400).json({ 
      error: 'Invalid parameters', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Suggest improvements
app.post('/suggest', async (req, res) => {
  try {
    const validatedParams = ParsedParametersSchema.parse(req.body);
    const suggestions = await nlpService.suggestImprovements(validatedParams);
    res.json({ suggestions });
  } catch (error) {
    console.error('Suggestion error:', error);
    res.status(400).json({ 
      error: 'Invalid parameters', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Classify intent
app.post('/classify', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }
    const intent = await nlpService.classifyIntent(text);
    res.json({ intent });
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ 
      error: 'Classification failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Analyze sentiment
app.post('/sentiment', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }
    const sentiment = await nlpService.analyzeSentiment(text);
    res.json(sentiment);
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ 
      error: 'Sentiment analysis failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`NLP Service running on port ${PORT}`);
});