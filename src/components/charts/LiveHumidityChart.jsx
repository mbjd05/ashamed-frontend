import useMqttStore from "../../store/mqttStore";
import ChartBase from "./ChartBase";

const LiveHumidityChart = () => {
    const sensorData = useMqttStore((state) => state.sensorData);

    return (
        <ChartBase
            title="Live Humidity"
            dataKey="humidity"
            data={sensorData}
            color="#387908"
            yUnit="%"
        />
    );
};

export default LiveHumidityChart;
