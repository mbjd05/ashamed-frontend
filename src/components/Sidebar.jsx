import {NavLink} from 'react-router-dom';
import {
    RiHome4Line,
    RiHistoryLine,
    RiMenuLine,
    RiMenuFoldLine,
    RiMenuUnfoldLine,
    RiCameraLensLine
} from '@remixicon/react';
import {useState} from "react";

const navItems = [
    {title: 'Home', icon: RiHome4Line, path: '/'},
    {title: 'Historical Data', icon: RiHistoryLine, path: '/historyview'},
    {title: 'Snapshots', icon: RiCameraLensLine, path: '/snapshots'},
];

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const getMenuIcon = () => {
        if (isHovered) {
            return isOpen ? <RiMenuFoldLine/> : <RiMenuUnfoldLine/>;
        }
        return <RiMenuLine/>;
    };

    return (
        <div
            className={`h-screen bg-gray-800 dark:bg-slate-950 transition-all duration-300 ease-in-out flex-shrink-0 ${isOpen ? 'w-64' : 'w-20'}`}>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
                    <div className="flex items-center">
                        <button
                            onClick={toggleSidebar}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className="p-2 rounded-lg focus:outline-none transition-colors duration-300 hover:bg-gray-700 hover:text-purple-500"
                        >
                            {getMenuIcon()}
                        </button>
                        <h1 className={`ml-4 text-xl font-semibold text-white truncate transition-all duration-300 ${isOpen ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'}`}>
                            Dashboard
                        </h1>
                    </div>
                </div>

                <nav className="flex-1 py-6">
                    {navItems.map(({title, icon: Icon, path}) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({isActive}) =>
                                `flex items-center text-white ${isActive ? 'bg-gray-700' : ''} hover:text-purple-500`
                            }
                        >
                            <div className="w-20 h-12 flex justify-center items-center flex-shrink-0">
                                <Icon className="text-xl"/>
                            </div>
                            <span
                                className={`truncate transition-all duration-300 overflow-hidden whitespace-nowrap ${isOpen ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'}`}>
                                {title}
                            </span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
