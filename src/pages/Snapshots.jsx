import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import ChartBase from "../components/charts/ChartBase";
import HistoricalDataTable from "../components/MeasurementsTable";
import SnapshotModal from "../components/SnapshotModal";

const API_BASE_URL = "https://localhost:443/api";

const Snapshots = () => {
    const [snapshots, setSnapshots] = useState([]);
    const [selectedSnapshot, setSelectedSnapshot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [clearTrigger, setClearTrigger] = useState(0);
    const [editingSnapshot, setEditingSnapshot] = useState(null);

    const fetchSnapshots = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/snapshot`);
            if (response.data.snapshots && Array.isArray(response.data.snapshots)) {
                setSnapshots(response.data.snapshots);
            } else {
                console.error("Snapshots data is not an array or not found:", response.data);
            }
        } catch (error) {
            console.error("Error fetching snapshots:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSnapshotDetails = useCallback(async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/snapshot/${id}`);
            setSelectedSnapshot(response.data);
        } catch (error) {
            console.error("Error fetching snapshot details:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSnapshots();
    }, [fetchSnapshots]);
    useEffect(() => {
        if (snapshots.length > 0) {
            const newestSnapshot = snapshots[snapshots.length - 1];
            fetchSnapshotDetails(newestSnapshot.id);
        }
    }, [snapshots, fetchSnapshotDetails]);

    const openModal = useCallback((snapshot = null) => {
        setEditingSnapshot(snapshot);
        setClearTrigger((prev) => prev + 1);
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setEditingSnapshot(null);
    }, []);

    const handleEditSnapshot = async (title, description) => {
        try {
            setLoading(true);
            await axios.put(`${API_BASE_URL}/snapshot/${editingSnapshot.id}`, {
                title,
                description,
            });
            setModalOpen(false);
            await fetchSnapshots();
            await fetchSnapshotDetails(editingSnapshot.id);
        } catch (error) {
            console.error("Error updating snapshot:", error);
            alert("Failed to update snapshot.");
        } finally {
            setLoading(false);
            setEditingSnapshot(null);
        }
    };

    const handleDeleteSnapshot = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`${API_BASE_URL}/snapshot/${id}`);
            alert("Snapshot deleted successfully!");
            await fetchSnapshots();
            if (selectedSnapshot && selectedSnapshot.id === id) {
                setSelectedSnapshot(null);
            }
        } catch (error) {
            console.error("Error deleting snapshot:", error);
            alert("Failed to delete snapshot.");
        } finally {
            setLoading(false);
        }
    };

    const getTimeRange = (messages) => {
        if (!messages || !Array.isArray(messages) || messages.length === 0) return "N/A";
        const timestamps = messages.map((msg) => new Date(msg.timestamp));
        const minTime = new Date(Math.min(...timestamps));
        const maxTime = new Date(Math.max(...timestamps));
        return `${minTime.toLocaleString()} - ${maxTime.toLocaleString()}`;
    };

    const renderCharts = () => {
        if (!selectedSnapshot || !selectedSnapshot.messages || !Array.isArray(selectedSnapshot.messages) || selectedSnapshot.messages.length === 0) {
            return null;
        }

        const chartData = selectedSnapshot.messages.map((msg) => ({
            timestamp: new Date(msg.timestamp).toISOString(),
            co2: msg.deserializedPayload.co2,
            temperature: msg.deserializedPayload.temperature,
            humidity: msg.deserializedPayload.humidity,
        }));

        return (
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
                <ChartBase title="CO2 Levels" dataKey="co2" data={chartData} color="indigo" />
                <ChartBase title="Temperature" dataKey="temperature" data={chartData} color="red" />
                <ChartBase title="Humidity" dataKey="humidity" data={chartData} color="green" />
            </div>
        );
    };
    
    const renderDescription = (htmlContent) => {
        const sanitizedHTML = DOMPurify.sanitize(htmlContent);
        return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
    };

    return (
        <div className="flex p-6 space-x-6 h-screen">
            <div className="w-1/3 overflow-y-auto" style={{ height: 'calc(100vh - 2rem)' }}>
                <h1 className="text-2xl font-semibold mb-4">Snapshots</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <ul className="space-y-4">
                        {[...snapshots].reverse().map((snapshot) => (
                            <li key={snapshot.id} className="border-b pb-4">
                                <div className="cursor-pointer" onClick={() => fetchSnapshotDetails(snapshot.id)}>
                                    <h3 className="font-semibold">{snapshot.title}</h3>
                                    <p className="text-sm text-gray-500">{getTimeRange(snapshot.messages)}</p>
                                </div>
                                <div className="flex space-x-2 mt-2">
                                    <button className="text-blue-500" onClick={() => openModal(snapshot)}>Edit</button>
                                    <button className="text-red-500" onClick={() => handleDeleteSnapshot(snapshot.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="w-2/3 overflow-y-auto" style={{ height: 'calc(100vh - 2rem)' }}>
                {selectedSnapshot ? (
                    <>
                        <h2 className="text-2xl font-semibold">{selectedSnapshot.title}</h2>
                        <div className="mt-2">
                            {renderDescription(selectedSnapshot.description)}
                        </div>
                        {renderCharts()}
                        <HistoricalDataTable chartData={selectedSnapshot.messages.map((msg) => ({
                            timestamp: new Date(msg.timestamp).toISOString(),
                            co2: msg.deserializedPayload.co2,
                            temperature: msg.deserializedPayload.temperature,
                            humidity: msg.deserializedPayload.humidity,
                        }))} />
                    </>
                ) : (
                    <p>Select a snapshot to view details</p>
                )}
            </div>

            <SnapshotModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleEditSnapshot}
                clearTrigger={clearTrigger}
                editingSnapshot={editingSnapshot}
            />
        </div>
    );
};

export default Snapshots;