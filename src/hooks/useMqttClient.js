import mqtt from "mqtt";
import useMqttStore from "../store/mqttStore";
import { useRef, useEffect, useCallback } from 'react';

const useMqttClient = (topic) => {
    const setSensorData = useMqttStore.getState().setSensorData;
    const clientRef = useRef(null);
    const retryTimesRef = useRef(0);
    const maxRetries = 5;

    // Define the connect function inside the hook
    const connect = useCallback(() => {
        if (clientRef.current) {
            return clientRef.current;
        }

        const connectUrl = "ws://host.docker.internal:8883";
        const options = {
            clientId: `mqtt_${Math.random().toString(16).slice(2, 10)}`,
            protocol: "ws",
            rejectUnauthorized: false,
            reconnectPeriod: 5000,
            connectTimeout: 30000
        };

        const client = mqtt.connect(connectUrl, options);

        client.on("connect", () => {
            retryTimesRef.current = 0;
            client.subscribe(topic, { qos: 1 }, (err) => {
                if (err) console.error(`Subscription error: ${err}`);
            });
        });

        client.on("message", (receivedTopic, message) => {
            if (receivedTopic === topic) {
                try {
                    const data = JSON.parse(message.toString());
                    setSensorData(data);
                } catch (err) {
                    console.error("Failed to parse MQTT message:", err);
                }
            }
        });

        client.on("reconnect", () => {
            retryTimesRef.current += 1;
            console.log("Retrying connection", retryTimesRef.current);
            if (retryTimesRef.current >= maxRetries) {
                console.log("Max reconnection attempts reached, stopping retry");
                client.end(true);
                clientRef.current = null;
            }
        });

        client.on("error", (err) => {
            console.error("MQTT connection error:", err);
            client.end(true);
            clientRef.current = null;
        });

        clientRef.current = client;
        return client;
    }, [setSensorData, topic]);

    useEffect(() => {
        const client = connect();
        return () => {
            if (client) {
                client.end(true);
                clientRef.current = null;
            }
        };
    }, [connect]);  // Add 'connect' as a dependency

    return { connect };
};

export default useMqttClient;