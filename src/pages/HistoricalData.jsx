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
            const response = await axios.post("/api/data", {
                startDate: dateRange.from,
                endDate: dateRange.to,
            });

            // Assume the backend sends an array of data points for the timeframe
            setChartData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            {/* Date Picker Section */}
            <div className="mx-auto max-w-lg space-y-6">
                <p className="text-center font-mono text-sm">
                    Select a Date Range
                </p>
                <DateRangePicker
                    value={dateRange}
                    onValueChange={(range) => setDateRange(range)}
                    minDate={firstDayOfPreviousYear} // Allow selection only from the first day of the previous year
                    maxDate={today} // Allow selection only up to today
                    weekStartsOn={1} // Set Monday as the first day of the week
                    enableSelect={true} // Enable select menu
                    enableClear={true} // Allow clearing selections
                    placeholder="Select a date range" // Custom placeholder text
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

            {/* Chart Section */}
            {chartData.length > 0 && (
                <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                    <ChartBase
                        title="CO2 Levels"
                        dataKey="co2"
                        data={chartData}
                        color="blue"
                        yUnit="ppm"/>
                    <ChartBase
                        title="Temperature"
                        dataKey="temperature"
                        data={chartData}
                        color="red"
                        yUnit="°C"/>
                    <ChartBase
                        title="Humidity"
                        dataKey="humidity"
                        data={chartData}
                        color="green"
                        yUnit="%"/>
                </div>
            )}
        </div>
    );
};

export default HistoricalData;
