import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAppContext } from '../context/AppContext';
import { User, Loader2, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const Login = () => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { updateStatus } = useAppContext();

    const handleJoin = async (e) => {
        e.preventDefault();

        if (!supabase) {
            setError("Configuration Error: Supabase client is missing. Please check env vars.");
            return;
        }

        if (!username.trim()) return;

        setLoading(true);
        setError(null);

        try {
            // 1. Try Anonymous Login first (Best for "Join" flows without rate limits on emails)
            let authData;
            let authError;

            // Try anonymous
            const anonResult = await supabase.auth.signInAnonymously({
                options: {
                    data: { username }
                }
            });

            if (anonResult.error) {
                // If Anonymous is disabled, we might have to fall back to the random email apprach,
                // BUT we just hit a rate limit there. 
                // So we should report the error and ask user to check config or wait.
                console.warn("Anonymous login failed, trying signup fallback...", anonResult.error);
                throw anonResult.error;
            }

            authData = anonResult.data;
            const user = authData.user;

            if (user) {

                const { error: profileError } = await supabase.from('profiles').insert({
                    id: user.id,
                    username: username,
                    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
                    status: 'Available',
                    location: 'Just Joined',
                    updated_at: new Date().toISOString()
                });

                if (profileError) {
                    // Ignore duplicate key error if trigger created it
                    if (!profileError.message.includes('duplicate key')) {
                        console.error("Profile creation failed", profileError);
                    }
                }

                // Force a status update to ensure context is fresh
                // updateStatus is available from context but might need the session to be set first
                // Navigation handles the rest as AppContext listens to auth state changes
                navigate('/');
            }

        } catch (err) {
            console.error("Join Error:", err);
            setError(err.message || "Could not join. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Join the Crew</h2>
                <p className="text-slate-400 mt-2">Enter a username to start hanging out.</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleJoin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Before we start, what should we call you?</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-slate-500" size={20} />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-cyan-500 focus:border-cyan-500 placeholder-slate-600"
                            placeholder="e.g. Maverick"
                            required
                            minLength={2}
                            maxLength={15}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                        <>
                            Join Now <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>

            <div className="text-center text-xs text-slate-600 px-4">
                By joining, you agree to be cool and not spam the map.
            </div>
        </div>
    );
};

export default Login;
