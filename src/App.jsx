import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import HistoricalData from './pages/HistoricalData';

const App = () => {
    return (
        <Router>
            <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
                <Sidebar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <div className="container mx-auto px-6 py-8">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/settings" element={<HistoricalData />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </Router>
    );
};

export default App;