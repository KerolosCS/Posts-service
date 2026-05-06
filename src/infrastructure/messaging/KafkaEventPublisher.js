import { Kafka } from 'kafkajs';

export class KafkaEventPublisher {
  constructor(broker, topic) {
    const kafkaConfig = {
      clientId: 'posts-service',
      brokers: [broker || 'kafka:9092']
    };

    console.log('[Kafka] KAFKA_API_KEY present:', !!process.env.KAFKA_API_KEY);
    console.log('[Kafka] broker:', kafkaConfig.brokers[0]);

    if (process.env.KAFKA_API_KEY && process.env.KAFKA_API_SECRET) {
      kafkaConfig.ssl = true;
      kafkaConfig.sasl = {
        mechanism: 'plain',
        username: process.env.KAFKA_API_KEY,
        password: process.env.KAFKA_API_SECRET
      };
    }

    this.kafka = new Kafka(kafkaConfig);
    this.producer = this.kafka.producer();
    this.topic = topic || 'post-events';
    this.isConnected = false;
  }

  async connect() {
    if (!this.isConnected) {
      await this.producer.connect();
      this.isConnected = true;
      console.log('Kafka producer connected');
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await this.producer.disconnect();
      this.isConnected = false;
      console.log('Kafka producer disconnected');
    }
  }

  async publish(event) {
    await this.connect();

    await this.producer.send({
      topic: this.topic,
      messages: [{
        key: event.type,
        value: JSON.stringify(event),
        headers: {
          'event-type': event.type,
          'timestamp': event.timestamp
        }
      }]
    });

    console.log(`Published event: ${event.type}`);
  }
}
