import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameSettings {
    soundEnabled: boolean;
    musicEnabled: boolean;
    notificationsEnabled: boolean;
    theme: 'light' | 'dark' | 'auto';
}

interface UIState {
    isSidebarOpen: boolean;
    activeModal: string | null;
    activePage: string;
}

interface GameStore {
    settings: GameSettings;
    ui: UIState;

    // Settings Actions
    toggleSound: () => void;
    toggleMusic: () => void;
    toggleNotifications: () => void;
    setTheme: (theme: GameSettings['theme']) => void;

    // UI Actions
    toggleSidebar: () => void;
    openModal: (modalId: string) => void;
    closeModal: () => void;
    setActivePage: (page: string) => void;
}

export const useGameStore = create<GameStore>()(
    persist(
        (set) => ({
            settings: {
                soundEnabled: true,
                musicEnabled: true,
                notificationsEnabled: true,
                theme: 'auto'
            },

            ui: {
                isSidebarOpen: true,
                activeModal: null,
                activePage: 'home'
            },

            // Settings Actions
            toggleSound: () => set((state) => ({
                settings: {
                    ...state.settings,
                    soundEnabled: !state.settings.soundEnabled
                }
            })),

            toggleMusic: () => set((state) => ({
                settings: {
                    ...state.settings,
                    musicEnabled: !state.settings.musicEnabled
                }
            })),

            toggleNotifications: () => set((state) => ({
                settings: {
                    ...state.settings,
                    notificationsEnabled: !state.settings.notificationsEnabled
                }
            })),

            setTheme: (theme) => set((state) => ({
                settings: {
                    ...state.settings,
                    theme
                }
            })),

            // UI Actions
            toggleSidebar: () => set((state) => ({
                ui: {
                    ...state.ui,
                    isSidebarOpen: !state.ui.isSidebarOpen
                }
            })),

            openModal: (modalId) => set((state) => ({
                ui: {
                    ...state.ui,
                    activeModal: modalId
                }
            })),

            closeModal: () => set((state) => ({
                ui: {
                    ...state.ui,
                    activeModal: null
                }
            })),

            setActivePage: (page) => set((state) => ({
                ui: {
                    ...state.ui,
                    activePage: page
                }
            }))
        }),
        {
            name: 'dust-and-glory-game'
        }
    )
);
