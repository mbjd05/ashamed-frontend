import PropTypes from 'prop-types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from "@tremor/react";

const HistoricalDataTable = ({ chartData }) => {
    return (
        <div className="mx-auto max-w-2xl mt-8">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>Timestamp</TableHeaderCell>
                        <TableHeaderCell>CO2</TableHeaderCell>
                        <TableHeaderCell>Temperature</TableHeaderCell>
                        <TableHeaderCell>Humidity</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {chartData.map((dataPoint, index) => (
                        <TableRow key={index}>
                            {/* Convert the timestamp to a human-readable string */}
                            <TableCell>{new Date(dataPoint.timestamp).toLocaleString()}</TableCell>
                            <TableCell>{dataPoint.co2}</TableCell>
                            <TableCell>{dataPoint.temperature}</TableCell>
                            <TableCell>{dataPoint.humidity}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

HistoricalDataTable.propTypes = {
    chartData: PropTypes.arrayOf(
        PropTypes.shape({
            timestamp: PropTypes.string.isRequired, // Ensure timestamp is a string or Date
            co2: PropTypes.number.isRequired,
            temperature: PropTypes.number.isRequired,
            humidity: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default HistoricalDataTable;
