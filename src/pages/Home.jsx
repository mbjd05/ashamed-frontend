import { useEffect } from "react";
import LiveCO2Chart from "../components/charts/LiveCO2Chart";
import LiveTempChart from "../components/charts/LiveTempChart";
import LiveHumidityChart from "../components/charts/LiveHumidityChart";
import useMqttClient from "../hooks/useMqttClient";
import { Card } from "@tremor/react";

const Home = () => {
    const { connect } = useMqttClient("z2m/air-monitor");

    useEffect(() => {
        connect();
    }, [connect]);

    return (
        <div className="w-full space-y-6 px-4">
            <h1 className="text-2xl font-bold">Live Environmental Data</h1>
            <div className="space-y-6 w-full">
                <Card>
                    <LiveCO2Chart />
                </Card>
                <Card>
                    <LiveTempChart />
                </Card>
                <Card>
                    <LiveHumidityChart />
                </Card>
            </div>
        </div>
    );
};

export default Home;