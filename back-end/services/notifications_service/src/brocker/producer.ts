import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: "omma_brocker",
    brokers: ['localhost:9092']
})

export const ProduceNotificationToKafka = async (notification: any) => {
    try {
        const producer = kafka.producer();
        await producer.connect();
        console.log("Connected to topic producer (notifications service)");

        const result = await producer.send({
            topic:"omma_notifications",
            messages: [
                { value: JSON.stringify(notification), partition:0 },
            ],
        })

        console.log("Result of (notifications service) sent: " + JSON.stringify(result));
        await producer.disconnect();
    } catch (error) {
        console.error("Error at (notifications service) producer.ts: ", error);
    }
}