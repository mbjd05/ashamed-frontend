import { useState } from "react";
import axios from "axios";
import { DateRangePicker } from "@tremor/react";
import ChartBase from "../components/charts/ChartBase";

const HistoricalData = () => {
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);

    const today = new Date();
    const firstDayOfPreviousYear = new Date(today.getFullYear() - 1, 0, 1);

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
                timestamp: entry.timestamp,
                co2: entry.deserializedPayload.co2,
                temperature: entry.deserializedPayload.temperature,
                humidity: entry.deserializedPayload.humidity,
            }));

            setChartData(transformedData);
        } catch (error) {
            console.error("Error fetching data:", error);

            if (error.response?.status === 404) {
                alert(error.response.data.Message || "No data found for the specified criteria.");
            } else {
                alert("Failed to fetch data. Please try again.");
            }
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

    const handleSnapshot = () => {
        alert("Snapshot functionality will be implemented later.");
    };

    return (
        <div className="p-8">
            <div className="mx-auto max-w-lg space-y-6">
                <p className="text-center font-mono text-sm">Select a Date Range</p>
                <DateRangePicker
                    value={dateRange}
                    onValueChange={(range) => setDateRange(range)}
                    minDate={firstDayOfPreviousYear}
                    maxDate={today}
                    weekStartsOn={1}
                    enableSelect={true}
                    enableClear={true}
                    placeholder="Select a custom date range"
                    className="mx-auto"
                />
                <button
                    onClick={fetchData}
                    className="w-full py-2 rounded-md bg-primary hover:bg-primary-dark transition-all duration-200"
                    disabled={loading}
                >
                    {loading ? "Fetching Data..." : "Fetch Data"}
                </button>
            </div>

            {chartData.length > 0 && (
                <>
                    <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                        <ChartBase
                            title="CO2 Levels"
                            dataKey="co2"
                            data={chartData}
                            color="indigo"
                        />
                        <ChartBase
                            title="Temperature"
                            dataKey="temperature"
                            data={chartData}
                            color="red"
                        />
                        <ChartBase
                            title="Humidity"
                            dataKey="humidity"
                            data={chartData}
                            color="green"
                        />
                    </div>

                    <div className="mt-10">
                        <table className="w-full border-collapse border border-gray-200">
                            <thead>
                            <tr>
                                <th className="border px-4 py-2 text-left">Timestamp</th>
                                <th className="border px-4 py-2 text-left">CO2</th>
                                <th className="border px-4 py-2 text-left">Temperature</th>
                                <th className="border px-4 py-2 text-left">Humidity</th>
                            </tr>
                            </thead>
                            <tbody>
                            {chartData.map((dataPoint, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{dataPoint.timestamp}</td>
                                    <td className="border px-4 py-2">{dataPoint.co2}</td>
                                    <td className="border px-4 py-2">{dataPoint.temperature}</td>
                                    <td className="border px-4 py-2">{dataPoint.humidity}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSnapshot}
                            className="py-2 px-4 rounded-md bg-secondary hover:bg-secondary-dark transition-all duration-200"
                        >
                            Snapshot These Measurements
                        </button>
                    </div>
                </div>
                </>
                )}
        </div>
    );
};

export default HistoricalData;
