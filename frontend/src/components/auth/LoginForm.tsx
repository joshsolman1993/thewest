import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { WesternButton } from '../ui';

export const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(username, password);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
                <div className="p-3 bg-[rgba(255,0,0,0.1)] border border-[var(--color-error)] text-[var(--color-error)] rounded text-sm">
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-1">
                <label className="text-[var(--color-leather-dark)] font-bold text-sm uppercase">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 bg-[rgba(255,255,255,0.5)] border-2 border-[var(--color-leather)] rounded focus:border-[var(--color-gold)] outline-none font-[var(--font-ui)]"
                    placeholder="BillyTheKid"
                    required
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[var(--color-leather-dark)] font-bold text-sm uppercase">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 bg-[rgba(255,255,255,0.5)] border-2 border-[var(--color-leather)] rounded focus:border-[var(--color-gold)] outline-none font-[var(--font-ui)]"
                    placeholder="••••••••"
                    required
                />
            </div>

            <WesternButton
                variant="primary"
                type="submit"
                disabled={isLoading}
                className="mt-2"
            >
                {isLoading ? 'Saddling up...' : 'Enter the West'}
            </WesternButton>
        </form>
    );
};
