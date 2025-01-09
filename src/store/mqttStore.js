import { create } from "zustand";

const useMqttStore = create((set) => ({
    sensorData: [], // Array to hold live data
    setSensorData: (dataPoint) =>
        set((state) => ({
            // Limit data to the last 100 points for a live chart view
            sensorData: [...state.sensorData, dataPoint].slice(-100),
        })),
}));

export default useMqttStore;
