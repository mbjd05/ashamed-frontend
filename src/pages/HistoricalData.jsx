import { useState } from "react";
import axios from "axios";
import { DateRangePicker } from "@tremor/react";
import ChartBase from "../components/charts/ChartBase";

const HistoricalData = () => {
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Calculate limits for DateRangePicker
    const today = new Date();
    const firstDayOfPreviousYear = new Date(today.getFullYear() - 1, 0, 1); // Jan 1st of previous year

    const fetchData = async () => {
        if (!dateRange.from || !dateRange.to) {
            alert("Please select a valid date range.");
            return;
        }

        setLoading(true);

        try {
            // Hardcoded topic
            const topic = "z2m/air-monitor";

            // Convert the 'from' and 'to' dates to UTC
            const start = convertToUTC(dateRange.from); // Start at 00:00:00 UTC
            const end = convertToUTC(dateRange.to, true); // End at 23:59:59.999 UTC

            // Hardcoded Backend URL
            const backendUrl = "https://localhost:443/api"; // Replace with your actual backend URL

            // Make GET request to the backend
            const response = await axios.get(`${backendUrl}/mqtt/messages`, {
                params: {
                    topic: topic,
                    start: start.toISOString(), // Send as UTC ISO string
                    end: end.toISOString(),     // Send as UTC ISO string
                },
            });

            // Transform the response data into the format expected by tremor charts
            const transformedData = response.data.map((entry) => ({
                timestamp: entry.timestamp, // Use timestamp as the x-axis value
                co2: entry.deserializedPayload.co2,
                temperature: entry.deserializedPayload.temperature,
                humidity: entry.deserializedPayload.humidity,
            }));

            // Update state with the transformed data
            setChartData(transformedData);
        } catch (error) {
            console.error("Error fetching data:", error);

            // Show an error alert based on status code
            if (error.response?.status === 404) {
                alert(error.response.data.Message || "No data found for the specified criteria.");
            } else {
                alert("Failed to fetch data. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

// Utility function to convert the date to UTC
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
            {/* Date Picker Section */}
            <div className="mx-auto max-w-lg space-y-6">
                <p className="text-center font-mono text-sm">Select a Date Range</p>

                {/* DateRangePicker */}
                <DateRangePicker
                    value={dateRange}
                    onValueChange={(range) => setDateRange(range)}
                    minDate={firstDayOfPreviousYear} // Allow selection only from the first day of the previous year
                    maxDate={today} // Allow selection only up to today
                    weekStartsOn={1} // Set Monday as the first day of the week
                    enableSelect={true} // Enable select menu
                    enableClear={true} // Allow clearing selections
                    placeholder="Select a custom date range" // Custom placeholder text
                    className="mx-auto"
                />

                {/* Fetch Data Button */}
                <button
                    onClick={fetchData}
                    className="w-full py-2 rounded-md bg-primary hover:bg-primary-dark transition-all duration-200"
                    disabled={loading}
                >
                    {loading ? "Fetching Data..." : "Fetch Data"}
                </button>
            </div>

            {/* Chart Section */}
            {chartData.length > 0 && (
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
            )}
        </div>
    );
};

export default HistoricalData;
