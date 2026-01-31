import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Upload, Loader2, Camera } from 'lucide-react';

const ProfileSetup = () => {
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const navigate = useNavigate();

    const handleUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload to Storage
            let { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setAvatarUrl(data.publicUrl);

            // 3. Update Profile
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id);
            }

        } catch (error) {
            console.error(error);
            alert('Error uploading avatar!');
        } finally {
            setUploading(false);
        }
    };

    const handleComplete = () => {
        navigate('/');
    };

    return (
        <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold text-white">Setup Profile</h2>
            <p className="text-slate-400">Upload a profile picture so your friends can recognize you on the map.</p>

            <div className="relative inline-block mt-4">
                <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center overflow-hidden mx-auto">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <Camera size={40} className="text-slate-600" />
                    )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-cyan-600 rounded-full text-white cursor-pointer hover:bg-cyan-500 shadow-lg">
                    {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                    <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
                </label>
            </div>

            <button
                onClick={handleComplete}
                className="w-full py-3 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/40 mt-8"
            >
                Complete Setup
            </button>
        </div>
    );
};

export default ProfileSetup;
