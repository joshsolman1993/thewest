import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { WesternButton } from '../ui';

export const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);

    const { register, isLoading, error } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (password !== confirmPassword) {
            setLocalError("Passwords don't match, partner!");
            return;
        }

        await register(username, email, password);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {(error || localError) && (
                <div className="p-3 bg-[rgba(255,0,0,0.1)] border border-[var(--color-error)] text-[var(--color-error)] rounded text-sm">
                    {error || localError}
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
                <label className="text-[var(--color-leather-dark)] font-bold text-sm uppercase">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 bg-[rgba(255,255,255,0.5)] border-2 border-[var(--color-leather)] rounded focus:border-[var(--color-gold)] outline-none font-[var(--font-ui)]"
                    placeholder="cowboy@example.com"
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

            <div className="flex flex-col gap-1">
                <label className="text-[var(--color-leather-dark)] font-bold text-sm uppercase">Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? 'Signing up...' : 'Join the Frontier'}
            </WesternButton>
        </form>
    );
};
