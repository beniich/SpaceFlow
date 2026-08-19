const { Kafka } = require('kafkajs');

const broker = process.env.KAFKA_BROKER || 'localhost:9092';
const topicName = process.argv[2];

if (!topicName) {
    console.error('Usage: node replay_dlq.js <original_topic_name>');
    process.exit(1);
}

const dlqTopic = `${topicName}.DLQ`;

const kafka = new Kafka({
    clientId: 'dlq-replayer',
    brokers: [broker]
});

const consumer = kafka.consumer({ groupId: 'dlq-replayer-group' });
const producer = kafka.producer();

const run = async () => {
    try {
        await consumer.connect();
        await producer.connect();
        console.log(`🔄 Replaying from ${dlqTopic} to ${topicName}`);

        await consumer.subscribe({ topic: dlqTopic, fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const value = message.value.toString();
                const headers = message.headers;
                console.log(`📥 Read from DLQ: ${value}`);

                // Remove DLQ specific headers if desired, or keep them for audit
                // Republish to original topic
                await producer.send({
                    topic: topicName,
                    messages: [{
                        value: value,
                        // key: message.key // Optional: keep key
                    }]
                });

                console.log(`📤 Republished to ${topicName}`);
            }
        });

    } catch (e) {
        console.error('Error:', e);
    }
};

run();
