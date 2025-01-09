import { LineChart } from "@tremor/react";
import PropTypes from "prop-types";

const ChartBase = ({ title, dataKey, data, color }) => (
    <div className="w-full">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <LineChart
            className="w-full h-80"
            data={data}
            index="time"
            categories={[dataKey]}
            colors={[color]}
            yAxisWidth={60}
        />
    </div>
);

ChartBase.propTypes = {
    title: PropTypes.string.isRequired,
    dataKey: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    color: PropTypes.string.isRequired,
    yUnit: PropTypes.string.isRequired,
};

export default ChartBase;