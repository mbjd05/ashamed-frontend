import { useState, useCallback } from "react";
import axios from "axios";
import { DateRangePicker } from "@tremor/react";
import ChartBase from "../components/charts/ChartBase";
import MeasurementsDataTable from "../components/MeasurementsTable.jsx";
import SnapshotModal from "../components/SnapshotModal";

const HistoricalData = () => {
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [chartData, setChartData] = useState([]);
    const [fullMessages, setFullMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [clearTrigger, setClearTrigger] = useState(0);
    const [hasFetched, setHasFetched] = useState(false); // New state to track fetch execution

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const handleDateChange = (range) => {
        const adjustedRange = { ...range };
        if (range.from && range.from > today) {
            adjustedRange.from = today;
        }
        if (range.to && range.to > today) {
            adjustedRange.to = today;
        }
        setDateRange(adjustedRange);
    };

    const fetchData = async () => {
        if (!dateRange.from) {
            alert("Please select a valid date.");
            return;
        }

        setLoading(true);
        setHasFetched(true); // Mark that a request has been executed

        try {
            const topic = "z2m/air-monitor";
            const encodedTopic = encodeURIComponent(topic);
            const start = convertToUTC(dateRange.from);
            const end = dateRange.to ? convertToUTC(dateRange.to, true) : convertToUTC(dateRange.from, true);
            const backendUrl = "https://host.docker.internal:443/api";

            const response = await axios.get(`${backendUrl}/mqtt/${encodedTopic}/messages-by-time-range`, {
                params: {
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
            await axios.post("https://host.docker.internal:443/api/snapshots", {
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
        setClearTrigger((prev) => prev + 1);
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
                        onValueChange={handleDateChange}
                        className="flex-1"
                        maxDate={today}
                        data-cy="date-range-picker"
                    />
                    <button
                        onClick={fetchData}
                        className="py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded"
                        disabled={loading}
                        data-cy="data-fetch"
                    >
                        {loading ? "Fetching Data..." : "Fetch Data"}
                    </button>
                </div>
            </div>

            {loading && (
                <div className="text-center mt-6">
                    <p className="text-lg font-semibold text-gray-500">Loading data...</p>
                </div>
            )}

            {!loading && hasFetched && chartData.length === 0 && (
                <div className="text-center mt-10">
                    <div className="p-6 bg-gray-100 border border-gray-300 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-gray-700">No Data Found</h2>
                        <p className="mt-2 text-gray-600">
                            No messages were found for the selected topic and time range. Try adjusting the date range or ensuring data is available.
                        </p>
                    </div>
                </div>
            )}

            {!loading && chartData.length > 0 && (
                <>
                    <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                        <ChartBase title="CO2 Levels" dataKey="co2" data={chartData} color="indigo"/>
                        <ChartBase title="Temperature" dataKey="temperature" data={chartData} color="red"/>
                        <ChartBase title="Humidity" dataKey="humidity" data={chartData} color="green"/>
                    </div>

                    <div className="text-center mt-6">
                        <button
                            onClick={openModal}
                            className="py-2 px-4 bg-blue-600 text-white rounded"
                            data-cy="snapshot-create"
                        >
                            Create Snapshot
                        </button>
                    </div>

                    <MeasurementsDataTable chartData={chartData}/>
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
