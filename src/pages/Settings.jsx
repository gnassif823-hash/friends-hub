import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Bell, Shield, Save } from 'lucide-react';

const Settings = () => {
    const { currentUser } = useAppContext();
    const [formData, setFormData] = useState({
        name: currentUser.name,
        avatar: currentUser.avatar,
        notifications: true,
        locationSharing: 'precise', // precise, city, off
    });
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-slate-100 mb-8">Settings</h1>

            <div className="bg-slate-900 rounded-3xl shadow-xl border border-slate-800 overflow-hidden">
                <form onSubmit={handleSubmit} className="divide-y divide-slate-800">

                    {/* Profile Section */}
                    <div className="p-8">
                        <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                            <User size={20} className="text-cyan-400" />
                            Profile
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Display Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-xl bg-slate-950 border-slate-700 text-slate-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-2.5"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Avatar URL</label>
                                <input
                                    type="text"
                                    value={formData.avatar}
                                    onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                                    className="w-full rounded-xl bg-slate-950 border-slate-700 text-slate-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 p-2.5"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="p-8">
                        <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                            <Bell size={20} className="text-cyan-400" />
                            Notifications
                        </h2>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="notif"
                                checked={formData.notifications}
                                onChange={e => setFormData({ ...formData, notifications: e.target.checked })}
                                className="w-5 h-5 text-cyan-600 bg-slate-950 border-slate-700 rounded focus:ring-cyan-500"
                            />
                            <label htmlFor="notif" className="text-slate-300">Enable push notifications for friend updates</label>
                        </div>
                    </div>

                    {/* Privacy */}
                    <div className="p-8">
                        <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-cyan-400" />
                            Privacy & Location
                        </h2>
                        <div className="space-y-3">
                            {['precise', 'city', 'off'].map((option) => (
                                <div key={option} className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        id={option}
                                        name="location"
                                        value={option}
                                        checked={formData.locationSharing === option}
                                        onChange={e => setFormData({ ...formData, locationSharing: e.target.value })}
                                        className="w-4 h-4 text-cyan-600 bg-slate-950 border-slate-700 focus:ring-cyan-500"
                                    />
                                    <label htmlFor={option} className="text-slate-300 capitalize">
                                        {option === 'precise' && 'Share Precise Location (Recommended)'}
                                        {option === 'city' && 'Share City Only'}
                                        {option === 'off' && 'Do Not Share Location'}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="p-8 bg-slate-950/50 flex items-center justify-between border-t border-slate-800">
                        {saved ? (
                            <span className="text-green-400 font-medium flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                Changes saved successfully!
                            </span>
                        ) : <span></span>}

                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-900/40"
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Settings;
