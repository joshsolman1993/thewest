import { useState } from 'react';
import { ParchmentPanel } from '../components/ui';
import { PhaserMap } from '../components/map/PhaserMap';

export const MapPage = () => {
    const [currentLocation, setCurrentLocation] = useState('Dusty Gulch');

    return (
        <div>
            <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '3rem',
                color: 'var(--color-leather-darkest)',
                marginBottom: 'var(--space-6)',
                textAlign: 'center'
            }}>
                Wild West
            </h1>

            <ParchmentPanel title="World Map" seal>
                <PhaserMap onLocationChange={setCurrentLocation} />
            </ParchmentPanel>

            <div style={{ marginTop: 'var(--space-6)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <ParchmentPanel title="Locations">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {[
                            { name: 'Dusty Gulch', type: '🏛️ Town', level: 1 },
                            { name: 'Silver City', type: '🏙️ Town', level: 3 },
                            { name: 'Gold Mine', type: '⛏️ Mine', level: 2 },
                            { name: 'Desert Camp', type: '⛺ Camp', level: 1 },
                            { name: 'Old Fort', type: '🏰 Landmark', level: 4 },
                            { name: 'Canyon Pass', type: '🏜️ Landmark', level: 2 },
                        ].map(loc => (
                            <div key={loc.name} style={{
                                padding: 'var(--space-3)',
                                background: 'rgba(107,68,35,0.1)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600 }}>
                                        {loc.name}
                                    </div>
                                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: 'var(--color-leather)' }}>
                                        {loc.type}
                                    </div>
                                </div>
                                <div style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '0.875rem',
                                    color: 'var(--color-gold)',
                                    background: 'rgba(212,175,55,0.2)',
                                    padding: 'var(--space-1) var(--space-2)',
                                    borderRadius: 'var(--radius-sm)'
                                }}>
                                    Lv. {loc.level}
                                </div>
                            </div>
                        ))}
                    </div>
                </ParchmentPanel>

                <ParchmentPanel title="Travel Info">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div>
                            <h4 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--color-gold)' }}>
                                Current Location
                            </h4>
                            <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
                                🤠 {currentLocation}
                            </p>
                        </div>

                        <div>
                            <h4 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--color-gold)' }}>
                                Travel Cost
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--color-leather)' }}>
                                Click a location on the map to travel. Travel time depends on distance.
                            </p>
                        </div>

                        <div style={{
                            padding: 'var(--space-3)',
                            background: 'rgba(212,175,55,0.1)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-gold)'
                        }}>
                            <p style={{ margin: 0, fontSize: '0.875rem' }}>
                                💡 <strong>Tip:</strong> Drag to pan the map and scroll to zoom in/out.
                            </p>
                        </div>
                    </div>
                </ParchmentPanel>
            </div>
        </div>
    );
};
