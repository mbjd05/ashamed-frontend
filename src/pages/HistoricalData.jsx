import { useState, useCallback } from "react";
import axios from "axios";
import { DateRangePicker } from "@tremor/react"; // Assuming you have a DateRangePicker component that supports time
import ChartBase from "../components/charts/ChartBase";
import HistoricalDataTable from "../components/MeasurementsTable.jsx";
import SnapshotModal from "../components/SnapshotModal";

const HistoricalData = () => {
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [chartData, setChartData] = useState([]);
    const [fullMessages, setFullMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [clearTrigger, setClearTrigger] = useState(0);

    const fetchData = async () => {
        if (!dateRange.from) {
            alert("Please select a valid date.");
            return;
        }

        setLoading(true);

        try {
            const topic = "z2m/air-monitor";
            const start = convertToUTC(dateRange.from);
            const end = dateRange.to ? convertToUTC(dateRange.to, true) : convertToUTC(dateRange.from, true);
            const backendUrl = "https://localhost:443/api";

            const response = await axios.get(`${backendUrl}/mqtt/messages`, {
                params: {
                    topic: topic,
                    start: start.toISOString(),
                    end: end.toISOString(),
                },
            });

            if (response.status === 200) {
                setFullMessages(response.data);
                const transformedData = response.data.map((entry) => ({
                    id: entry.id,
                    timestamp: entry.timestamp,
                    co2: entry.deserializedPayload.co2,
                    temperature: entry.deserializedPayload.temperature,
                    humidity: entry.deserializedPayload.humidity,
                }));
                setChartData(transformedData);
            } else {
                setFullMessages([]);
                setChartData([]);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                alert("No messages found for this topic within the specified time range.");
                setFullMessages([]);
                setChartData([]);
            } else if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                console.error("Error fetching data:", error);
                alert("Failed to fetch data. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSnapshot = async (title, description) => {
        if (fullMessages.length === 0) {
            alert("No data available to create a snapshot.");
            return;
        }

        setLoading(true);

        try {
            await axios.post("https://localhost:443/api/snapshot", {
                title,
                description,
                messages: fullMessages,
            }, {
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                }
            });

            alert("Snapshot created successfully!");
            setModalOpen(false);
        } catch (error) {
            console.error('Error creating snapshot:', error.response?.data || error.message);
            alert("Failed to create snapshot.");
        } finally {
            setLoading(false);
        }
    };

    const convertToUTC = (date, isEndOfDay = false) => {
        if (!date) return null;
        const utcDate = new Date(date);
        return new Date(
            Date.UTC(
                utcDate.getFullYear(),
                utcDate.getMonth(),
                utcDate.getDate(),
                isEndOfDay ? 23 : 0,
                isEndOfDay ? 59 : 0,
                isEndOfDay ? 59 : 0,
                isEndOfDay ? 999 : 0
            )
        );
    };

    const openModal = useCallback(() => {
        setClearTrigger(prev => prev + 1);
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold">Historical Environmental Data</h1>
            <div className="mx-auto max-w-lg space-y-6">
                <p className="text-center font-mono text-sm">Select a Date Range</p>

                <div className="flex items-center gap-4">
                    <DateRangePicker
                        value={dateRange}
                        onValueChange={(range) => setDateRange(range)}
                        className="flex-1"
                        showTimePicker // Assuming this prop enables time input
                    />
                    <button
                        onClick={fetchData}
                        className="py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded"
                        disabled={loading}
                    >
                        {loading ? "Fetching Data..." : "Fetch Data"}
                    </button>
                </div>
            </div>

            {chartData.length > 0 && (
                <>
                    <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                        <ChartBase title="CO2 Levels" dataKey="co2" data={chartData} color="indigo"/>
                        <ChartBase title="Temperature" dataKey="temperature" data={chartData} color="red"/>
                        <ChartBase title="Humidity" dataKey="humidity" data={chartData} color="green"/>
                    </div>

                    <HistoricalDataTable chartData={chartData}/>

                    <div className="text-center mt-6">
                        <button
                            onClick={openModal}
                            className="py-2 px-4 bg-blue-600 text-white rounded"
                        >
                            Create Snapshot
                        </button>
                    </div>
                </>
            )}

            <SnapshotModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSaveSnapshot}
                clearTrigger={clearTrigger}
            />
        </div>
    );
};

export default HistoricalData;
