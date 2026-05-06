import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const port = process.env.PORT || 8080;
http.createServer((req, res) => res.writeHead(200).end('OK')).listen(port, () => {
  console.log(`Health check server listening on port ${port}`);
});

const kafkaConfig = {
  clientId: 'posts-consumer',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092']
};

if (process.env.KAFKA_API_KEY && process.env.KAFKA_API_SECRET) {
  kafkaConfig.ssl = true;
  kafkaConfig.sasl = {
    mechanism: 'plain',
    username: process.env.KAFKA_API_KEY,
    password: process.env.KAFKA_API_SECRET
  };
}

const kafka = new Kafka(kafkaConfig);
let currentConsumer;
let isShuttingDown = false;

async function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log('Shutting down consumer...');
  if (currentConsumer) {
    await currentConsumer.disconnect();
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function processEvent(event) {
  console.log(`\n[${new Date().toISOString()}] Processing event: ${event.type}`);
  console.log('Payload:', JSON.stringify(event.payload, null, 2));

  switch (event.type) {
    case 'POST_CREATED':
      console.log(`Post created by ${event.payload.author}: "${event.payload.title}"`);
      break;
    default:
      console.log('Unknown event type:', event.type);
  }

  console.log('Event processed successfully\n');
}

async function startWithRetry() {
  const topic = process.env.KAFKA_TOPIC || 'post-events';
  const consumer = kafka.consumer({ groupId: 'posts-processing-group' });
  currentConsumer = consumer;

  while (!isShuttingDown) {
    try {
      await consumer.connect();
      console.log('Kafka consumer connected');

      await consumer.subscribe({ topic, fromBeginning: true });
      console.log(`Subscribed to topic: ${topic}`);

      await consumer.run({
        eachMessage: async ({ message }) => {
          try {
            await processEvent(JSON.parse(message.value.toString()));
          } catch (err) {
            console.error('Error processing message:', err.message);
            throw err;
          }
        }
      });

      return;
    } catch (err) {
      if (isShuttingDown) return;

      console.error('Consumer failed to start, retrying in 5s...', err.message);
      try { await consumer.disconnect(); } catch (_) { }
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

startWithRetry();
