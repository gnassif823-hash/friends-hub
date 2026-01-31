import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppContext } from '../context/AppContext';
import { Icon } from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';

// Fix for default Leaflet icon
const DefaultIcon = new Icon({
    iconUrl: markerIconPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: null,
});

const LiveMap = () => {
    const { friends } = useAppContext();
    const availableFriends = friends.filter(f => f.status === 'Available' && f.coordinates);

    // Default center (NYC)
    const defaultCenter = [40.7128, -74.0060];

    return (
        <div className="h-full w-full relative bg-slate-950">
            <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Render Friends Markers */}
                {availableFriends.map(friend => (
                    <Marker
                        key={friend.id}
                        position={friend.coordinates}
                        icon={DefaultIcon}
                    >
                        <Popup className="custom-popup">
                            <div className="text-center">
                                <img src={friend.avatar} alt={friend.username} className="w-10 h-10 rounded-full mx-auto mb-2 border-2 border-slate-900" />
                                <div className="font-bold text-slate-900">{friend.username}</div>
                                <div className="text-sm text-slate-500">{friend.location}</div>
                                <div className="text-xs italic mt-1 text-slate-600">"{friend.message}"</div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* POI Markers (Mock) */}
                <Marker position={[40.7200, -74.0100]} icon={DefaultIcon}>
                    <Popup>
                        <strong>Central Perks Cafe</strong><br />
                        Perfect spot for coffee!
                    </Popup>
                </Marker>

            </MapContainer>

            {/* Overlay controls */}
            <div className="absolute top-4 right-4 z-[500] bg-slate-900/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-slate-800 max-w-xs text-slate-100">
                <h3 className="font-bold mb-3 border-b border-slate-700 pb-2">Active Friends</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {availableFriends.map(friend => (
                        <div key={friend.id} className="flex items-center gap-3 text-sm cursor-pointer hover:bg-slate-800 p-2 rounded-lg transition-colors">
                            <div className="relative">
                                <img src={friend.avatar} alt={friend.username} className="w-6 h-6 rounded-full" />
                                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                            </div>
                            <span>{friend.username}</span>
                        </div>
                    ))}
                    {availableFriends.length === 0 && <span className="text-slate-500 text-sm italic">No one is active.</span>}
                </div>
            </div>
        </div>
    );
};

export default LiveMap;
