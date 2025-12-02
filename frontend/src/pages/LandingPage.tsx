import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { WesternButton } from '../components/ui';

export const LandingPage = () => {
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const scrollToAuth = () => {
        document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#e0d4b4] overflow-x-hidden font-sans selection:bg-[#d4af37] selection:text-black">

            {/* Hero Section */}
            <div className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Parallax Background */}
                <motion.div
                    style={{ y: y1 }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533167649158-6d508895b680?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-[#0a0a0a]" />
                </motion.div>

                {/* Hero Content */}
                <motion.div
                    style={{ opacity }}
                    className="relative z-10 text-center px-4 max-w-5xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <h2 className="font-[Cinzel] text-[#d4af37] tracking-[0.2em] text-sm md:text-xl mb-4 uppercase">
                            Forged in the Badlands
                        </h2>
                        <h1 className="font-[Rye] text-7xl md:text-9xl text-white mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] tracking-wide">
                            DUST <span className="text-[#d4af37]">&</span> GLORY
                        </h1>
                        <p className="font-[Cinzel] text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                            Where legends are born in blood and gold. <br />
                            Carve your path through the unforgiving frontier.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <WesternButton
                            variant="primary"
                            size="lg"
                            onClick={scrollToAuth}
                            className="text-xl px-16 py-5 border-2 border-[#d4af37] bg-black/50 hover:bg-[#d4af37] hover:text-black transition-all duration-300 uppercase tracking-widest font-[Cinzel] shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                        >
                            Begin Your Saga
                        </WesternButton>
                    </motion.div>
                </motion.div>
            </div>

            {/* Features Section */}
            <div className="py-32 px-4 bg-[#0a0a0a] relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="font-[Rye] text-4xl md:text-5xl text-[#d4af37] mb-4">The Lawless Frontier</h2>
                        <div className="h-1 w-24 bg-[#d4af37] mx-auto" />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <FeatureCard
                            icon="⚔️"
                            title="Ruthless Combat"
                            description="Engage in high-stakes turn-based duels. Every bullet counts, every scar tells a story."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon="🦅"
                            title="Open World"
                            description="Explore a vast, living world. From the dusty saloons to the perilous mines."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon="💰"
                            title="Economy & Trade"
                            description="Build your fortune. Trade goods, upgrade your town, and control the market."
                            delay={0.6}
                        />
                    </div>
                </div>
            </div>

            {/* Auth Section */}
            <div id="auth-section" className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20" />
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

                <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden border border-[#333]">

                    {/* Left Panel: Art/Text */}
                    <div className="bg-black/80 p-12 flex flex-col justify-center relative border-r border-[#333]">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1547626740-02cb6aed9ef8?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale" />
                        <div className="relative z-10">
                            <h3 className="font-[Rye] text-4xl text-[#d4af37] mb-6">
                                {authMode === 'login' ? 'Welcome Back, Gunslinger' : 'Join the Ranks'}
                            </h3>
                            <p className="font-[Cinzel] text-gray-400 text-lg leading-relaxed mb-8">
                                {authMode === 'login'
                                    ? "The saloon is open, and the cards are dealt. Your reputation precedes you."
                                    : "Fresh blood in the badlands? Make a name for yourself, or die trying."}
                            </p>
                            <div className="flex gap-4">
                                <div className="h-2 w-2 bg-[#d4af37] rounded-full animate-pulse" />
                                <div className="h-2 w-2 bg-[#d4af37] rounded-full animate-pulse delay-75" />
                                <div className="h-2 w-2 bg-[#d4af37] rounded-full animate-pulse delay-150" />
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Form */}
                    <div className="bg-[#111] p-12 flex flex-col justify-center backdrop-blur-sm bg-opacity-90">
                        <div className="flex mb-8 bg-black/50 p-1 rounded-lg border border-[#333]">
                            <button
                                className={`flex-1 py-3 rounded-md font-[Cinzel] text-sm font-bold tracking-wider transition-all duration-300 ${authMode === 'login' ? 'bg-[#d4af37] text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                onClick={() => setAuthMode('login')}
                            >
                                LOGIN
                            </button>
                            <button
                                className={`flex-1 py-3 rounded-md font-[Cinzel] text-sm font-bold tracking-wider transition-all duration-300 ${authMode === 'register' ? 'bg-[#d4af37] text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                onClick={() => setAuthMode('register')}
                            >
                                REGISTER
                            </button>
                        </div>

                        <motion.div
                            key={authMode}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {authMode === 'login' ? <LoginForm /> : <RegisterForm />}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-black py-8 text-center border-t border-[#333]">
                <p className="font-[Cinzel] text-gray-600 text-sm tracking-widest">
                    &copy; 2025 DUST & GLORY. ALL RIGHTS RESERVED.
                </p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: string, title: string, description: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="group relative p-8 rounded-xl bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border border-[#333] hover:border-[#d4af37] transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]"
    >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="relative z-10">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300 filter grayscale group-hover:grayscale-0">{icon}</div>
            <h3 className="font-[Cinzel] text-2xl text-[#d4af37] mb-4 tracking-wide">{title}</h3>
            <p className="font-sans text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{description}</p>
        </div>
    </motion.div>
);
