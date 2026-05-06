import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from '../infrastructure/database/mongoose/connection.js';
import { MongoosePostRepository } from '../infrastructure/database/mongoose/MongoosePostRepository.js';
import { KafkaEventPublisher } from '../infrastructure/messaging/KafkaEventPublisher.js';
import { createPostRoutes } from './routes/postRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const postRepository = new MongoosePostRepository();
const eventPublisher = new KafkaEventPublisher(
  process.env.KAFKA_BROKER,
  process.env.KAFKA_TOPIC
);

app.use('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/posts', createPostRoutes(postRepository, eventPublisher));
app.use(errorHandler);

async function init() {
  try {
    await connectDatabase(process.env.MONGODB_URI);
    await eventPublisher.connect?.();
    console.log('Dependencies connected');

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });

    const shutdown = async () => {
      console.log('Shutting down...');
      server.close(async () => {
        await eventPublisher.disconnect?.();
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
}

init();
