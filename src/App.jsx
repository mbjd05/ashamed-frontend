import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import HistoricalData from './pages/HistoricalData';
import Snapshots from './pages/Snapshots';

const App = () => {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <Router>
                <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
                    <Sidebar />
                    <main className="flex-grow overflow-x-hidden overflow-y-auto">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/historyview" element={<HistoricalData />} />
                            <Route path={"/snapshots"} element={<Snapshots />} />
                            <Route path="*" element={<div>Error 404: Not found</div>} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </MantineProvider>
    );
};

export default App;

