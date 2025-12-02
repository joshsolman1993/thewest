import { useState, useEffect, lazy, Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { ParchmentPanel } from './components/ui';
import { useAuthStore } from './store/authStore';
import './index.css';

// Lazy load pages
const CharacterPage = lazy(() => import('./pages/CharacterPage').then(m => ({ default: m.CharacterPage })));
const MapPage = lazy(() => import('./pages/MapPage').then(m => ({ default: m.MapPage })));
const TownPage = lazy(() => import('./pages/TownPage').then(m => ({ default: m.TownPage })));
const QuestsPage = lazy(() => import('./pages/QuestsPage').then(m => ({ default: m.QuestsPage })));
const DuelPage = lazy(() => import('./pages/DuelPage').then(m => ({ default: m.DuelPage })));
const ComponentsShowcasePage = lazy(() => import('./pages/ComponentsShowcasePage').then(m => ({ default: m.ComponentsShowcasePage })));

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Simple hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setCurrentPage(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'character':
        return <CharacterPage />;
      case 'map':
        return <MapPage />;
      case 'town':
        return <TownPage />;
      case 'quests':
        return <QuestsPage />;
      case 'inventory':
        return (
          <ParchmentPanel title="Inventory">
            <p>Inventory system coming soon...</p>
          </ParchmentPanel>
        );
      case 'saloon':
        return (
          <ParchmentPanel title="Saloon">
            <p>Welcome to the Saloon! 🍺</p>
          </ParchmentPanel>
        );
      case 'shop':
        return (
          <ParchmentPanel title="General Store">
            <p>Shop system coming soon...</p>
          </ParchmentPanel>
        );
      case 'showcase':
        return <ComponentsShowcasePage />;
      case 'duel':
        return <DuelPage />;
      default:
        return <HomePage />;
    }
  };

  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout>
        <Suspense fallback={
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Loading...</p>
          </div>
        }>
          {renderPage()}
        </Suspense>
      </DashboardLayout>
    </QueryClientProvider>
  );
}

// Home Page Component
const HomePage = () => {
  return (
    <div>
      {/* SVG Filters */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="parchment-texture">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" />
            <feColorMatrix type="saturate" values="0.4" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.2" />
              <feFuncG type="linear" slope="1.1" />
              <feFuncB type="linear" slope="0.9" />
            </feComponentTransfer>
            <feBlend mode="multiply" in2="SourceGraphic" />
          </filter>
        </defs>
      </svg>

      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '4rem',
        textAlign: 'center',
        color: 'var(--color-leather-darkest)',
        marginBottom: '2rem',
        textShadow: '2px 2px 0 rgba(212,175,55,0.3)'
      }}>
        Welcome, Cowboy!
      </h1>

      <ParchmentPanel title="Quick Actions" seal>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)'
        }}>
          <ActionCard
            icon="👤"
            title="Character"
            description="View your character stats and equipment"
            href="#character"
          />
          <ActionCard
            icon="🗺️"
            title="Explore"
            description="Travel across the Wild West"
            href="#map"
          />
          <ActionCard
            icon="🏛️"
            title="Town"
            description="Visit buildings and services"
            href="#town"
          />
          <ActionCard
            icon="📜"
            title="Quests"
            description="Accept and track your missions"
            href="#quests"
          />
        </div>

        <div style={{ marginTop: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Recent Activity</h3>
          <div style={{
            padding: 'var(--space-4)',
            background: 'rgba(107,68,35,0.1)',
            borderRadius: 'var(--radius-md)'
          }}>
            <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--color-leather)' }}>
              No recent activity. Start your adventure!
            </p>
          </div>
        </div>
      </ParchmentPanel>
    </div>
  );
};

// Action Card Component
interface ActionCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description, href }) => {
  return (
    <a
      href={href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'var(--space-5)',
        background: 'var(--gradient-parchment)',
        border: '2px solid var(--color-gold)',
        borderRadius: 'var(--radius-lg)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all var(--transition-normal)',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>
        {icon}
      </div>
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1.25rem',
        marginBottom: 'var(--space-2)',
        color: 'var(--color-leather-darkest)'
      }}>
        {title}
      </div>
      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.875rem',
        textAlign: 'center',
        color: 'var(--color-leather)'
      }}>
        {description}
      </div>
    </a>
  );
};

export default App;
