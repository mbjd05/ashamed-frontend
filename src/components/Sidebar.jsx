import { NavLink } from 'react-router-dom';
import { RiHome4Line, RiHistoryLine, RiMenuLine, RiMenuFoldLine, RiMenuUnfoldLine } from '@remixicon/react';
import { useState } from "react";

const navItems = [
    { title: 'Home', icon: () => <RiHome4Line />, path: '/' },
    { title: 'Historical Data', icon: () => <RiHistoryLine />, path: '/settings' },
];

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`${
                isOpen ? 'w-64' : 'w-20'
            } h-screen bg-gray-800 dark:bg-slate-950 transition-all duration-300 ease-in-out flex-shrink-0`}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="p-2 rounded-lg focus:outline-none transition-colors duration-300 hover:bg-gray-700 group"
                        >
                            {isHovered ? (
                                isOpen ? (
                                    <RiMenuFoldLine className="text-white group-hover:text-purple-500 text-xl"/>
                                ) : (
                                    <RiMenuUnfoldLine className="text-white group-hover:text-purple-500 text-xl"/>
                                )
                            ) : (
                                <RiMenuLine className="text-white text-xl"/>
                            )}
                        </button>
                        <h1 className={`ml-4 text-xl font-semibold text-white truncate transition-all duration-300 ${isOpen ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'}`}>
                            Dashboard
                        </h1>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 group">
                    {navItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            className={({isActive}) => `
                                flex items-center text-white
                                ${isActive ? 'bg-gray-700' : ''}
                                hover:text-purple-500 group-hover:text-white hover:!text-purple-500
                            `}
                        >
                            <div className="w-20 h-12 flex justify-center items-center flex-shrink-0">
                                <div className="text-xl">
                                    {item.icon()}
                                </div>
                            </div>
                            <span
                                className={`ml-4 truncate transition-all duration-300 
                                    ${isOpen ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'} 
                                    overflow-hidden whitespace-nowrap
                                `}
                            >
                                {item.title}
                            </span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
