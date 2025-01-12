import { useState } from "react";
import axios from "axios";
import { DateRangePicker } from "@tremor/react";
import ChartBase from "../components/charts/ChartBase";
import HistoricalDataTable from "../components/MeasurementsTable.jsx";
import SnapshotModal from "../components/SnapshotModal";

const HistoricalData = () => {
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    const fetchData = async () => {
        if (!dateRange.from || !dateRange.to) {
            alert("Please select a valid date range.");
            return;
        }

        setLoading(true);

        try {
            const topic = "z2m/air-monitor";
            const start = convertToUTC(dateRange.from);
            const end = convertToUTC(dateRange.to, true);
            const backendUrl = "https://localhost:443/api";

            const response = await axios.get(`${backendUrl}/mqtt/messages`, {
                params: {
                    topic: topic,
                    start: start.toISOString(),
                    end: end.toISOString(),
                },
            });

            const transformedData = response.data.map((entry) => ({
                id: entry.id,
                timestamp: entry.timestamp,
                co2: entry.deserializedPayload.co2,
                temperature: entry.deserializedPayload.temperature,
                humidity: entry.deserializedPayload.humidity,
            }));

            setChartData(transformedData);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSnapshot = async (title, description) => {
        if (chartData.length === 0) {
            alert("No data available to create a snapshot.");
            return;
        }

        setLoading(true);

        try {
            const messageIds = chartData.map((entry) => entry.id);
            
            await axios.post("https://localhost:443/api/snapshot", {
                title,
                description,
                messageIds,
            },
                {
                    headers: {
                        'accept': '*/*',
                        'Content-Type': 'application/json',
                    }}
                );

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

    return (
        <div className="p-8">
            <div className="mx-auto max-w-lg space-y-6">
                <p className="text-center font-mono text-sm">Select a Date Range</p>

                <div className="flex items-center gap-4">
                    <DateRangePicker
                        value={dateRange}
                        onValueChange={(range) => setDateRange(range)}
                        className="flex-1"
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
                        <ChartBase title="CO2 Levels" dataKey="co2" data={chartData} color="indigo" />
                        <ChartBase title="Temperature" dataKey="temperature" data={chartData} color="red" />
                        <ChartBase title="Humidity" dataKey="humidity" data={chartData} color="green" />
                    </div>

                    <HistoricalDataTable chartData={chartData} />

                    <div className="text-center mt-6">
                        <button
                            onClick={() => setModalOpen(true)}
                            className="py-2 px-4 bg-blue-600 text-white rounded"
                        >
                            Create Snapshot
                        </button>
                    </div>
                </>
            )}

            <SnapshotModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveSnapshot}
            />
        </div>
    );
};

export default HistoricalData;