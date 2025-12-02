import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { ResourceBar } from '../ui';
import { useCharacterStore } from '../../store/characterStore';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
    children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    // Get character data from Zustand store
    const { name, stats, fetchCharacter } = useCharacterStore();

    useEffect(() => {
        // Fetch character data when layout mounts
        fetchCharacter();
    }, [fetchCharacter]);

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.avatar}>🤠</div>
                    <div className={styles.characterInfo}>
                        <h2 className={styles.characterName}>{name}</h2>
                        <span className={styles.level}>Level {stats.level}</span>
                    </div>
                </div>

                <div className={styles.headerCenter}>
                    <div className={styles.resourceBars}>
                        <ResourceBar
                            type="hp"
                            current={stats.health}
                            max={stats.maxHealth}
                            showValue={true}
                        />
                        <ResourceBar
                            type="energy"
                            current={50}
                            max={100}
                            showValue={true}
                        />
                        <ResourceBar
                            type="xp"
                            current={stats.xp}
                            max={stats.maxXp}
                            showValue={false}
                        />
                    </div>
                </div>

                <div className={styles.headerRight}>
                    <div className={styles.currency}>
                        <span className={styles.currencyIcon}>💰</span>
                        <span className={styles.currencyValue}>${stats.gold.toLocaleString()}</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className={styles.mainContainer}>
                {/* Sidebar Navigation */}
                <aside className={styles.sidebar}>
                    <nav className={styles.nav}>
                        <a href="#character" className={styles.navItem}>
                            <span className={styles.navIcon}>👤</span>
                            <span className={styles.navLabel}>Character</span>
                        </a>
                        <a href="#map" className={styles.navItem}>
                            <span className={styles.navIcon}>🗺️</span>
                            <span className={styles.navLabel}>Map</span>
                        </a>
                        <a href="#inventory" className={styles.navItem}>
                            <span className={styles.navIcon}>🎒</span>
                            <span className={styles.navLabel}>Inventory</span>
                        </a>
                        <a href="#town" className={styles.navItem}>
                            <span className={styles.navIcon}>🏛️</span>
                            <span className={styles.navLabel}>Town</span>
                        </a>
                        <a href="#quests" className={styles.navItem}>
                            <span className={styles.navIcon}>📜</span>
                            <span className={styles.navLabel}>Quests</span>
                        </a>
                        <a href="#saloon" className={styles.navItem}>
                            <span className={styles.navIcon}>🍺</span>
                            <span className={styles.navLabel}>Saloon</span>
                        </a>
                        <a href="#shop" className={styles.navItem}>
                            <span className={styles.navIcon}>🛒</span>
                            <span className={styles.navLabel}>Shop</span>
                        </a>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className={styles.mainContent}>
                    {children}
                </main>

                {/* Right Sidebar (Activity/Chat) */}
                <aside className={styles.rightSidebar}>
                    <div className={styles.activityPanel}>
                        <h3 className={styles.panelTitle}>Activity</h3>
                        <div className={styles.activityList}>
                            <div className={styles.activityItem}>
                                <span className={styles.activityIcon}>⚔️</span>
                                <div className={styles.activityText}>
                                    <strong>Duel won</strong>
                                    <span className={styles.activityTime}>2m ago</span>
                                </div>
                            </div>
                            <div className={styles.activityItem}>
                                <span className={styles.activityIcon}>⛏️</span>
                                <div className={styles.activityText}>
                                    <strong>Mining complete</strong>
                                    <span className={styles.activityTime}>5m ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className={styles.bottomNav}>
                <a href="#character" className={styles.bottomNavItem}>
                    <span className={styles.navIcon}>👤</span>
                    <span className={styles.navLabel}>Character</span>
                </a>
                <a href="#map" className={styles.bottomNavItem}>
                    <span className={styles.navIcon}>🗺️</span>
                    <span className={styles.navLabel}>Map</span>
                </a>
                <a href="#inventory" className={styles.bottomNavItem}>
                    <span className={styles.navIcon}>🎒</span>
                    <span className={styles.navLabel}>Bag</span>
                </a>
                <a href="#town" className={styles.bottomNavItem}>
                    <span className={styles.navIcon}>🏛️</span>
                    <span className={styles.navLabel}>Town</span>
                </a>
                <a href="#more" className={styles.bottomNavItem}>
                    <span className={styles.navIcon}>⋯</span>
                    <span className={styles.navLabel}>More</span>
                </a>
            </nav>
        </div>
    );
};
