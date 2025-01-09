import { useEffect } from "react";
import LiveCO2Chart from "./components/charts/LiveCO2Chart";
import LiveTempChart from "./components/charts/LiveTempChart";
import LiveHumidityChart from "./components/charts/LiveHumidityChart.jsx";
import useMqttClient from "./hooks/useMqttClient";
import { Card, Grid } from "@tremor/react";

const App = () => {
    const { connect } = useMqttClient("sensor/data");

    useEffect(() => {
        connect();
    }, [connect]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Live Environmental Data</h1>
            <Grid numItemsMd={1} gap="6">
                <Card>
                    <LiveCO2Chart />
                </Card>
                <Card>
                    <LiveTempChart />
                </Card>
                <Card>
                    <LiveHumidityChart />
                </Card>
            </Grid>
        </div>
    );
};

export default App;
