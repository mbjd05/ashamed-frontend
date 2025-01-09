import mqtt from "mqtt";
import useMqttStore from "../store/mqttStore";

const useMqttClient = (topic) => {
    const setSensorData = useMqttStore.getState().setSensorData;

    const connect = () => {
        const connectUrl = "ws://localhost:8883"; // Adjust the URL if needed
        const options = {
            clientId: `mqtt_${Math.random().toString(16).slice(2, 10)}`,
            protocol: "ws",
            rejectUnauthorized: false,
        };

        const client = mqtt.connect(connectUrl, options);

        client.on("connect", () => {
            client.subscribe(topic, { qos: 1 }, (err) => {
                if (err) console.error(`Subscription error: ${err}`);
            });
        });

        client.on("message", (receivedTopic, message) => {
            if (receivedTopic === topic) {
                try {
                    const data = JSON.parse(message.toString());
                    setSensorData(data); // Pass data to the Zustand store
                } catch (err) {
                    console.error("Failed to parse MQTT message:", err);
                }
            }
        });

        client.on("error", (err) => {
            console.error("MQTT connection error:", err);
            client.end();
        });

        return client;
    };

    return { connect };
};

export default useMqttClient;
