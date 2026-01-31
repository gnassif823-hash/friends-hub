import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabaseClient';
import { Send, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const GroupLounge = () => {
    const { currentUser, session } = useAppContext();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatLoading, setChatLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!supabase) {
            setChatLoading(false);
            return;
        }

        // 1. Fetch Init Messages
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select(`
                id,
                text,
                created_at,
                user_id
            `)
                .order('created_at', { ascending: true })
                .limit(50);

            if (data) {
                // We need to fetch profiles for these users to display avatars
                // A join query would be better, but for now we'll rely on the fact that AppContext probably loaded profiles (or we fetch continuously)
                // Simpler: Just fetch profiles for authors
                const userIds = [...new Set(data.map(m => m.user_id))];
                const { data: profiles } = await supabase.from('profiles').select('id, username, avatar_url').in('id', userIds);

                const messagesWithProfiles = data.map(msg => {
                    const profile = profiles?.find(p => p.id === msg.user_id);
                    return { ...msg, profile };
                });
                setMessages(messagesWithProfiles);
            }
            setChatLoading(false);
        };

        fetchMessages();

        // 2. Subscribe to new messages
        const channel = supabase
            .channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
                const { data: profile } = await supabase.from('profiles').select('id, username, avatar_url').eq('id', payload.new.user_id).single();
                setMessages(prev => [...prev, { ...payload.new, profile }]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !supabase || !currentUser) return;

        const textPayload = newMessage;
        setNewMessage(''); // Optimistic clear

        await supabase.from('messages').insert({
            user_id: currentUser.id,
            text: textPayload
        });
    };

    if (chatLoading) {
        return <div className="h-full flex items-center justify-center bg-slate-950 text-cyan-400"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="h-full flex flex-col bg-slate-950">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 shadow-sm z-10">
                <div>
                    <h1 className="text-xl font-bold text-slate-100">Group Lounge</h1>
                    <p className="text-sm text-slate-400">Live Chat</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
                {messages.length === 0 && (
                    <div className="text-center text-slate-600 mt-10">No messages yet. Start the conversation!</div>
                )}
                {messages.map((msg) => {
                    const isMe = msg.user_id === currentUser?.id;

                    return (
                        <div key={msg.id} className={clsx("flex gap-3 max-w-[80%]", isMe ? "ml-auto flex-row-reverse" : "")}>
                            <img
                                src={msg.profile?.avatar_url || 'https://i.pravatar.cc/150'}
                                alt={msg.profile?.username}
                                className="w-8 h-8 rounded-full self-end mb-1 border border-slate-800"
                            />
                            <div className={clsx(
                                "p-3 rounded-2xl shadow-md break-words",
                                isMe ? "bg-cyan-600 text-white rounded-br-none shadow-cyan-900/20" : "bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none"
                            )}>
                                {!isMe && <div className="text-xs text-cyan-400 font-bold mb-1">{msg.profile?.username || 'Unknown'}</div>}
                                <div>{msg.text}</div>
                                <div className={clsx("text-[10px] mt-1 text-right opacity-60")}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900 border-t border-slate-800">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                    <button
                        type="submit"
                        className="p-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!newMessage.trim()}
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GroupLounge;
