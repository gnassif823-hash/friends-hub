import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Map, MessageSquare, Phone, Settings, LogOut } from 'lucide-react';
import clsx from 'clsx';

const NavigationItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                isActive
                    ? 'bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-cyan-400'
            )
        }
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </NavLink>
);

const Layout = () => {
    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-4 hidden md:flex">
                <div className="flex items-center gap-3 px-2 mb-8 mt-2">
                    <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20">
                        FH
                    </div>
                    <h1 className="text-xl font-bold text-slate-100">Friends Hub</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavigationItem to="/" icon={LayoutDashboard} label="The Hub" />
                    <NavigationItem to="/map" icon={Map} label="Live Map" />
                    <NavigationItem to="/lounge" icon={MessageSquare} label="Group Lounge" />
                    <NavigationItem to="/calls" icon={Phone} label="Call Center" />
                </nav>

                <div className="mt-auto border-t border-slate-800 pt-4 space-y-2">
                    <NavigationItem to="/settings" icon={Settings} label="Settings" />
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200">
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Navigation (Bottom Bar) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around p-3 z-50">
                <NavLink to="/" className={({ isActive }) => clsx('p-2 rounded-lg', isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-500')}>
                    <LayoutDashboard size={24} />
                </NavLink>
                <NavLink to="/map" className={({ isActive }) => clsx('p-2 rounded-lg', isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-500')}>
                    <Map size={24} />
                </NavLink>
                <NavLink to="/lounge" className={({ isActive }) => clsx('p-2 rounded-lg', isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-500')}>
                    <MessageSquare size={24} />
                </NavLink>
                <NavLink to="/calls" className={({ isActive }) => clsx('p-2 rounded-lg', isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-500')}>
                    <Phone size={24} />
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => clsx('p-2 rounded-lg', isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-500')}>
                    <Settings size={24} />
                </NavLink>
            </nav>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative bg-slate-950">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
