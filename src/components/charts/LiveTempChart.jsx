import useMqttStore from "../../store/mqttStore";
import ChartBase from "./ChartBase";

const LiveTempChart = () => {
    const sensorData = useMqttStore((state) => state.sensorData);

    return (
        <ChartBase
            title="Live Temperature"
            dataKey="temperature"
            data={sensorData}
            color="red"
        />
    );
};

export default LiveTempChart;
