import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // 1. Sign up with Supabase Auth
        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        if (data?.user) {
            // 2. Create Profile entry
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: data.user.id,
                    username: username,
                    status: 'Available',
                    avatar_url: 'https://i.pravatar.cc/150', // placeholder until setup
                });

            if (profileError) {
                console.error('Profile creation failed:', profileError);
                // Non-blocking error, user can fix profile later
            }

            navigate('/auth/setup'); // Send to profile setup
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">Create Account</h2>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-slate-500" size={20} />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder="CoolUser123"
                            required
                        />
                    </div>
                </div>

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
                            minLength={6}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
                </button>
            </form>

            <div className="text-center text-sm text-slate-500">
                Already have an account? <Link to="/auth/login" className="text-cyan-400 hover:underline font-medium">Log in</Link>
            </div>
        </div>
    );
};

export default SignUp;
