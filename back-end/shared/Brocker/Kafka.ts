import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: "omma_brocker",
    brokers: ['localhost:9092']
})