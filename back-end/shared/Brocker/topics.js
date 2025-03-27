import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: "omma_brocker",
    brokers: ['localhost:9092']
})

const topics = ["omma_notifications"]

const RunKafka = async () => {
    try {
        const admin = kafka.admin();
        await admin.connect();
        console.log("Connected to topic admin");
        await admin.createTopics({
            topics: [{
                topic:topics[0],
                numPartitions: 1
            }]
        });
        console.log("Created");
        await admin.disconnect();
    } catch (error) {
        console.error("Error at topic.ts: ", error);
    }
}

RunKafka();