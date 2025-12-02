import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import styles from './PhaserMap.module.css';

interface Location {
    x: number;
    y: number;
    name: string;
    type: 'town' | 'mine' | 'camp' | 'landmark';
    icon: string;
}

const LOCATIONS: Location[] = [
    { x: 200, y: 200, name: 'Dusty Gulch', type: 'town', icon: '🏛️' },
    { x: 500, y: 150, name: 'Silver City', type: 'town', icon: '🏙️' },
    { x: 350, y: 400, name: 'Gold Mine', type: 'mine', icon: '⛏️' },
    { x: 600, y: 350, name: 'Desert Camp', type: 'camp', icon: '⛺' },
    { x: 100, y: 450, name: 'Old Fort', type: 'landmark', icon: '🏰' },
    { x: 450, y: 250, name: 'Canyon Pass', type: 'landmark', icon: '🏜️' },
];

class MapScene extends Phaser.Scene {
    private locations: Phaser.GameObjects.Container[] = [];
    private playerMarker!: Phaser.GameObjects.Container;
    private currentLocation: string = 'Dusty Gulch';

    constructor() {
        super({ key: 'MapScene' });
    }

    create() {
        // Background - desert tiles
        const tileSize = 64;
        const mapWidth = 800;
        const mapHeight = 600;

        // Create desert terrain with subtle variations
        for (let x = 0; x < mapWidth; x += tileSize) {
            for (let y = 0; y < mapHeight; y += tileSize) {
                const shade = Math.random() * 20 - 10;
                const baseColor = 0xDCC9A8;
                const r = ((baseColor >> 16) & 0xFF) + shade;
                const g = ((baseColor >> 8) & 0xFF) + shade;
                const b = (baseColor & 0xFF) + shade;
                const color = (Math.max(0, Math.min(255, r)) << 16) |
                    (Math.max(0, Math.min(255, g)) << 8) |
                    Math.max(0, Math.min(255, b));

                const tile = this.add.rectangle(x, y, tileSize, tileSize, color, 1);
                tile.setOrigin(0, 0);
                tile.setStrokeStyle(1, 0xC9B88D, 0.3);
            }
        }

        // Add cacti decorations
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * mapWidth;
            const y = Math.random() * mapHeight;
            const text = this.add.text(x, y, '🌵', { fontSize: '24px' });
            text.setAlpha(0.6);
        }

        // Create location markers
        LOCATIONS.forEach(location => {
            const container = this.createLocationMarker(location);
            this.locations.push(container);
        });

        // Create player marker
        this.playerMarker = this.createPlayerMarker();
        const startLocation = LOCATIONS.find(l => l.name === this.currentLocation);
        if (startLocation) {
            this.playerMarker.setPosition(startLocation.x, startLocation.y);
        }

        // Setup camera
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.setZoom(1);

        // Mouse wheel zoom
        this.input.on('wheel', (_pointer: Phaser.Input.Pointer, _gameObjects: any[], _deltaX: number, deltaY: number) => {
            const zoom = this.cameras.main.zoom;
            const newZoom = Phaser.Math.Clamp(zoom - deltaY * 0.001, 0.5, 2);
            this.cameras.main.setZoom(newZoom);
        });

        // Enable dragging
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (pointer.isDown) {
                this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom;
                this.cameras.main.scrollY -= (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom;
            }
        });
    }

    createLocationMarker(location: Location): Phaser.GameObjects.Container {
        const container = this.add.container(location.x, location.y);

        // Background circle
        const circle = this.add.circle(0, 0, 25, 0x6B4423, 1);
        circle.setStrokeStyle(3, 0xD4AF37);

        // Icon
        const icon = this.add.text(0, 0, location.icon, { fontSize: '32px' });
        icon.setOrigin(0.5);

        // Label
        const label = this.add.text(0, 35, location.name, {
            fontSize: '14px',
            color: '#1A0F0A',
            backgroundColor: '#FFF9ED',
            padding: { x: 6, y: 3 }
        });
        container.add([circle, icon, label]);

        // Make interactive
        circle.setInteractive({ useHandCursor: true });
        circle.on('pointerover', () => {
            circle.setFillStyle(0x8B5A3C);
            this.tweens.add({
                targets: container,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        circle.on('pointerout', () => {
            circle.setFillStyle(0x6B4423);
            this.tweens.add({
                targets: container,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeIn'
            });
        });

        circle.on('pointerdown', () => {
            this.travelTo(location);
        });

        return container;
    }

    createPlayerMarker(): Phaser.GameObjects.Container {
        const container = this.add.container(0, 0);

        // Pulsing circle
        const pulse = this.add.circle(0, 0, 30, 0xD4AF37, 0.3);
        this.tweens.add({
            targets: pulse,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 2000,
            repeat: -1,
            ease: 'Sine.easeOut'
        });

        // Main marker
        const marker = this.add.text(0, 0, '🤠', { fontSize: '40px' });
        marker.setOrigin(0.5);

        // Bounce animation
        this.tweens.add({
            targets: marker,
            y: -5,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        container.add([pulse, marker]);
        container.setDepth(100);

        return container;
    }

    travelTo(location: Location) {
        // Animate player movement
        this.tweens.add({
            targets: this.playerMarker,
            x: location.x,
            y: location.y,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.currentLocation = location.name;
                this.game.events.emit('location-changed', location.name);
            }
        });

        // Camera follow
        this.tweens.add({
            targets: this.cameras.main,
            scrollX: location.x - this.cameras.main.width / 2,
            scrollY: location.y - this.cameras.main.height / 2,
            duration: 1000,
            ease: 'Power2'
        });
    }
}

interface PhaserMapProps {
    onLocationChange?: (locationName: string) => void;
}

export const PhaserMap: React.FC<PhaserMapProps> = ({ onLocationChange }) => {
    const gameRef = useRef<Phaser.Game | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || gameRef.current) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: containerRef.current,
            width: 800,
            height: 600,
            backgroundColor: '#E8D5B7',
            scene: MapScene,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            }
        };

        gameRef.current = new Phaser.Game(config);

        // Subscribe to location changes
        if (onLocationChange) {
            gameRef.current.events.on('location-changed', onLocationChange);
        }

        return () => {
            if (gameRef.current) {
                gameRef.current.events.off('location-changed');
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, [onLocationChange]);

    return (
        <div className={styles.container}>
            <div ref={containerRef} className={styles.gameContainer} />
            <div className={styles.controls}>
                <p className={styles.hint}>
                    🖱️ Drag to pan • Scroll to zoom • Click location to travel
                </p>
            </div>
        </div>
    );
};
