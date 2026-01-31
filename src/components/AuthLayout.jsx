import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-cyan-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-cyan-500/20 mx-auto mb-4">
                    FH
                </div>
                <h1 className="text-3xl font-bold text-slate-100">Friends Hub</h1>
                <p className="text-slate-400 mt-2">Connecting your crew, anywhere.</p>
            </div>

            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
