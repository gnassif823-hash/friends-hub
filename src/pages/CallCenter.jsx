import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useAppContext } from '../context/AppContext';
import { Loader2 } from 'lucide-react';

const CallCenter = () => {
    const { currentUser, loading } = useAppContext();

    if (loading || !currentUser) {
        return (
            <div className="h-full flex items-center justify-center bg-slate-950 text-cyan-400">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    const roomName = "Friends-Hub-Lounge-Main";

    return (
        <div className="h-full w-full bg-slate-950 flex flex-col">
            <div className="flex-1 w-full overflow-hidden relative">
                <JitsiMeeting
                    roomName={roomName}
                    configOverwrite={{
                        startWithAudioMuted: true,
                        disableThirdPartyRequests: true,
                        prejoinPageEnabled: false,
                        theme: 'dark',
                        toolbarButtons: [
                            'camera',
                            'chat',
                            'closedcaptions',
                            'desktop',
                            'filmstrip',
                            'fullscreen',
                            'hangup',
                            'help',
                            'microphone',
                            'participants-pane',
                            'profile',
                            'raisehand',
                            'security',
                            'select-background',
                            'settings',
                            'shout',
                            'tileview',
                            'toggle-camera',
                            'videoquality',
                        ],
                    }}
                    userInfo={{
                        displayName: currentUser.name || currentUser.username || "Friend",
                        email: currentUser.email, // If avail in session, otherwise optional
                    }}
                    interfaceConfigOverwrite={{
                        DEFAULT_BACKGROUND: '#0f172a', // slate-900
                        TOOLBAR_BUTTONS: [
                            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                            'security'
                        ],
                    }}
                    getIFrameRef={(iframeRef) => { iframeRef.style.height = '100%'; }}
                />
            </div>
        </div>
    );
};

export default CallCenter;
