import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import styles from './Character3DViewer.module.css';

interface Character3DViewerProps {
    characterClass?: string | null;
    avatar?: string;
}

// Simple cowboy character using basic geometries
const CowboyModel = ({ characterClass }: { characterClass?: string | null }) => {
    const groupRef = useRef<THREE.Group>(null);

    // Colors based on class
    const getClassColor = () => {
        switch (characterClass) {
            case 'duelist':
                return '#8B0000'; // Dark red
            case 'worker':
                return '#8B7355'; // Brown
            case 'soldier':
                return '#2F4F4F'; // Dark slate
            case 'adventurer':
                return '#D2691E'; // Chocolate
            default:
                return '#8B4513'; // Saddle brown
        }
    };

    const classColor = getClassColor();

    return (
        <group ref={groupRef} position={[0, -1, 0]}>
            {/* Head */}
            <mesh position={[0, 1.5, 0]}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial color="#FDBCB4" />
            </mesh>

            {/* Cowboy Hat */}
            <group position={[0, 1.9, 0]}>
                {/* Hat crown */}
                <mesh position={[0, 0.1, 0]}>
                    <cylinderGeometry args={[0.25, 0.25, 0.3, 32]} />
                    <meshStandardMaterial color={classColor} />
                </mesh>
                {/* Hat brim */}
                <mesh position={[0, -0.05, 0]} rotation={[0, 0, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
                    <meshStandardMaterial color={classColor} />
                </mesh>
                {/* Hat band */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.26, 0.26, 0.1, 32]} />
                    <meshStandardMaterial color="#D4AF37" />
                </mesh>
            </group>

            {/* Body (torso) */}
            <mesh position={[0, 0.7, 0]}>
                <boxGeometry args={[0.8, 1.2, 0.4]} />
                <meshStandardMaterial color={classColor} />
            </mesh>

            {/* Vest */}
            <mesh position={[0, 0.7, 0.21]}>
                <boxGeometry args={[0.7, 1.1, 0.02]} />
                <meshStandardMaterial color="#6B4423" />
            </mesh>

            {/* Belt buckle */}
            <mesh position={[0, 0.1, 0.21]}>
                <boxGeometry args={[0.15, 0.1, 0.02]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Arms */}
            <mesh position={[-0.5, 0.7, 0]} rotation={[0, 0, Math.PI / 6]}>
                <cylinderGeometry args={[0.1, 0.1, 0.8, 16]} />
                <meshStandardMaterial color={classColor} />
            </mesh>
            <mesh position={[0.5, 0.7, 0]} rotation={[0, 0, -Math.PI / 6]}>
                <cylinderGeometry args={[0.1, 0.1, 0.8, 16]} />
                <meshStandardMaterial color={classColor} />
            </mesh>

            {/* Hands */}
            <mesh position={[-0.7, 0.3, 0]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color="#FDBCB4" />
            </mesh>
            <mesh position={[0.7, 0.3, 0]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color="#FDBCB4" />
            </mesh>

            {/* Legs */}
            <mesh position={[-0.25, -0.3, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.9, 16]} />
                <meshStandardMaterial color="#4A4A4A" />
            </mesh>
            <mesh position={[0.25, -0.3, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.9, 16]} />
                <meshStandardMaterial color="#4A4A4A" />
            </mesh>

            {/* Boots */}
            <mesh position={[-0.25, -0.8, 0.1]} rotation={[0.1, 0, 0]}>
                <boxGeometry args={[0.18, 0.15, 0.3]} />
                <meshStandardMaterial color="#654321" />
            </mesh>
            <mesh position={[0.25, -0.8, 0.1]} rotation={[0.1, 0, 0]}>
                <boxGeometry args={[0.18, 0.15, 0.3]} />
                <meshStandardMaterial color="#654321" />
            </mesh>

            {/* Holster (for gunslinger) */}
            {(characterClass === 'duelist' || !characterClass) && (
                <mesh position={[0.35, 0, 0.15]} rotation={[0, 0, -Math.PI / 8]}>
                    <boxGeometry args={[0.1, 0.3, 0.15]} />
                    <meshStandardMaterial color="#6B4423" />
                </mesh>
            )}
        </group>
    );
};

export const Character3DViewer: React.FC<Character3DViewerProps> = ({
    characterClass = null,
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0.5, 4]} />
                    <OrbitControls
                        enablePan={false}
                        enableZoom={true}
                        minDistance={2}
                        maxDistance={6}
                        maxPolarAngle={Math.PI / 2}
                        minPolarAngle={Math.PI / 6}
                    />

                    {/* Lighting - Western warm tones */}
                    <ambientLight intensity={0.4} color="#FFF9ED" />
                    <directionalLight
                        position={[5, 5, 5]}
                        intensity={1.2}
                        color="#FFD4A3"
                        castShadow
                    />
                    <directionalLight
                        position={[-3, 2, -3]}
                        intensity={0.5}
                        color="#FFE4B5"
                    />
                    <spotLight
                        position={[0, 5, 0]}
                        angle={0.3}
                        penumbra={1}
                        intensity={0.5}
                        color="#FFDAB9"
                    />

                    {/* Environment for reflections */}
                    <Environment preset="sunset" />

                    {/* Character Model */}
                    <CowboyModel characterClass={characterClass} />

                    {/* Ground plane */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                        <planeGeometry args={[10, 10]} />
                        <meshStandardMaterial color="#DCC9A8" />
                    </mesh>
                </Canvas>
            </div>

            <div className={styles.controls}>
                <p className={styles.hint}>
                    🖱️ Drag to rotate • Scroll to zoom
                </p>
            </div>
        </div>
    );
};
