interface HealthBarProps {
    current: number;
    max: number;
    label?: string;
    showValue?: boolean;
}

export const HealthBar = ({ current, max, label, showValue = true }: HealthBarProps) => {
    const percentage = Math.max(0, Math.min(100, (current / max) * 100));

    // Color based on percentage
    let color = 'var(--color-success)';
    if (percentage < 30) color = 'var(--color-error)';
    else if (percentage < 60) color = 'var(--color-warning)';

    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-between mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-leather-dark)]">
                    <span>{label}</span>
                    {showValue && <span>{Math.round(current)} / {max}</span>}
                </div>
            )}
            <div className="h-4 bg-[rgba(0,0,0,0.3)] rounded-full border border-[var(--color-leather)] overflow-hidden relative">
                <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3)'
                    }}
                />
            </div>
        </div>
    );
};
