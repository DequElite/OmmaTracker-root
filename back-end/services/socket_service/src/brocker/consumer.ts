import { Kafka } from "kafkajs";
import { Server } from "socket.io";

export const kafka = new Kafka({
    clientId: "omma_brocker",
    brokers: ['localhost:9092']
})

export const ConsumeNotificationsToSocket = async (io: Server) => {
    try {
        const consumer = kafka.consumer({groupId:'notification-group'});
        await consumer.connect();
        console.log("Connected to topic consumer (socket service)");

        await consumer.subscribe({
            topic: "omma_notifications",
            fromBeginning: false
        });

        await consumer.run({
            eachMessage: async ({ message, partition }) => {
                if (!message.value) {
                    console.warn("Received null message, skipping...");
                    return;
                }
        
                const notification = JSON.parse(message.value.toString());
        
                io.emit("new_global_notification", notification);
        
                console.log(`Received message (socket service): ${message.value.toString()} on partition ${partition}`);
            }
        });
        

    } catch (error) {
        console.error("Error at consumer.ts (socket service): ", error);
    }
}