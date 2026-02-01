import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Data Load & Persistance
    useEffect(() => {
        // Check Config
        if (!supabase) {
            console.warn('Supabase not configured. App in Demo Mode.');
            // If Supabase is not configured, we just stop loading.
            // The app will effectively be broken/empty, which is better than fake data for this user.
            setLoading(false);
            return;
        }

        // 1. Get Session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                fetchProfile(session.user.id);
                fetchFriends();
            } else {
                setLoading(false);
            }
        });

        // 2. Auth Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchProfile(session.user.id);
                fetchFriends();
            } else {
                setCurrentUser(null);
                setFriends([]);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Realtime Subscription for Friends Status
    useEffect(() => {
        if (!supabase || !session) return;

        const channel = supabase
            .channel('public:profiles')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, (payload) => {
                // Update local state when any profile changes
                setFriends((prev) => {
                    const index = prev.findIndex(f => f.id === payload.new.id);
                    if (index !== -1) {
                        const newFriends = [...prev];
                        newFriends[index] = { ...prev[index], ...payload.new };
                        return newFriends;
                    } else if (payload.new.id !== currentUser?.id) {
                        // Add new friend if not self
                        return [...prev, payload.new];
                    }
                    return prev;
                });

                // Update self if needed (though usually optimistic)
                if (payload.new.id === currentUser?.id) {
                    setCurrentUser(payload.new);
                }
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, (payload) => {
                if (payload.new.id !== currentUser?.id) {
                    setFriends(prev => [...prev, payload.new]);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [session, currentUser?.id]);

    const fetchProfile = async (userId) => {
        try {
            const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
            if (data) setCurrentUser(data);
        } catch (e) { console.error(e); }
    };

    const fetchFriends = async () => {
        try {
            const { data } = await supabase.from('profiles').select('*');
            if (data) {
                // Filter out self
                const { data: { user } } = await supabase.auth.getUser();
                setFriends(data.filter(p => p.id !== user?.id));
            }
            setLoading(false);
        } catch (e) { console.error(e); setLoading(false); }
    };

    const [locationSharingEnabled, setLocationSharingEnabled] = useState(true);

    const toggleLocationSharing = async (enabled) => {
        setLocationSharingEnabled(enabled);
        if (currentUser) {
            // Update DB immediately
            const updates = {
                location_sharing: enabled,
                coordinates: enabled ? currentUser.coordinates : null, // Clear coords if disabled
                location: enabled ? 'Live on Map' : 'Ghost Mode'
            };
            await updateStatus(updates);
        }
    };

    const updateStatus = async (newStatus) => {
        if (!currentUser || !supabase) return;

        // If ghost mode is on, ensure we don't accidentally send coordinates unless we are enabling it
        if (!locationSharingEnabled && newStatus.coordinates && newStatus.location_sharing === undefined) {
            delete newStatus.coordinates;
            delete newStatus.location;
        }

        const updatedUser = { ...currentUser, ...newStatus };
        setCurrentUser(updatedUser); // Optimistic

        await supabase.from('profiles').update(newStatus).eq('id', currentUser.id);
    };

    const logout = async () => {
        if (supabase) await supabase.auth.signOut();
        else {
            setSession(null);
            setCurrentUser(null);
        }
    };

    const loginAsGuest = () => {
        setSession({ user: { id: 'guest-user-id' } });
        setCurrentUser({
            id: 'guest-user-id',
            username: 'Guest User',
            status: 'Available',
            location: 'Secret Base',
            availableUntil: 'Never',
            avatar: 'https://i.pravatar.cc/150?u=guest',
            notifications: false,
            locationSharing: 'approximate'
        });

        // Ensure friends are populated for the full experience
        if (friends.length === 0) {
            setFriends([
                {
                    id: 1,
                    username: 'Sarah',
                    status: 'Available',
                    location: 'Blue Bottle Coffee',
                    availableUntil: '17:30',
                    avatar: 'https://i.pravatar.cc/150?u=sarah',
                    message: 'Grabbing coffee, come join!',
                    coordinates: [40.7128, -74.0060],
                },
                {
                    id: 2,
                    username: 'Mike',
                    status: 'Busy',
                    location: 'Work',
                    availableUntil: '19:00',
                    avatar: 'https://i.pravatar.cc/150?u=mike',
                    message: 'In meetings all day.',
                    coordinates: [40.7580, -73.9855],
                }
            ]);
        }
    };

    const value = {
        session,
        currentUser,
        friends,
        loading,
        updateStatus,
        logout,
        locationSharingEnabled,
        toggleLocationSharing,
        loginAsGuest
    };

    return (
        <AppContext.Provider value={value}>
            {!loading && children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
