import useMqttStore from "../../store/mqttStore";
import ChartBase from "./ChartBase";

const LiveCO2Chart = () => {
    const sensorData = useMqttStore((state) => state.sensorData);

    return (
        <ChartBase
            title="Live CO2 Levels"
            dataKey="co2"
            data={sensorData}
            color="indigo"
            yUnit="ppm"
        />
    );
};

export default LiveCO2Chart;
