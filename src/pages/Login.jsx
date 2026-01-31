import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Mail, Lock, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Redirection handled by AuthContext listener or direct nav
            navigate('/');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">Welcome Back</h2>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-slate-500" size={20} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-500" size={20} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                </button>
            </form>

            <div className="text-center text-sm text-slate-500">
                Don't have an account? <Link to="/auth/signup" className="text-cyan-400 hover:underline font-medium">Sign up</Link>
            </div>
        </div>
    );
};

export default Login;
