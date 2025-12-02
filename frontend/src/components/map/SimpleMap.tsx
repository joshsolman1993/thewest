import styles from './SimpleMap.module.css';

interface Location {
    name: string;
    type: string;
    icon: string;
}

const LOCATIONS: Location[] = [
    { name: 'Dusty Gulch', type: '🏛️ Town', icon: '🏛️' },
    { name: 'Silver City', type: '🏙️ Town', icon: '🏙️' },
    { name: 'Gold Mine', type: '⛏️ Mine', icon: '⛏️' },
    { name: 'Desert Camp', type: '⛺ Camp', icon: '⛺' },
    { name: 'Old Fort', type: '🏰 Landmark', icon: '🏰' },
    { name: 'Canyon Pass', type: '🏜️ Landmark', icon: '🏜️' },
];

interface SimpleMapProps {
    onLocationChange?: (locationName: string) => void;
}

export const SimpleMap: React.FC<SimpleMapProps> = ({ onLocationChange }) => {
    return (
        <div className={styles.container}>
            <div className={styles.mapGrid}>
                {LOCATIONS.map((location) => (
                    <button
                        key={location.name}
                        className={styles.locationCard}
                        onClick={() => onLocationChange?.(location.name)}
                    >
                        <div className={styles.icon}>{location.icon}</div>
                        <div className={styles.name}>{location.name}</div>
                        <div className={styles.type}>{location.type}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};
