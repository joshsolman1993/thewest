import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './ResourceBar.module.css';

interface ResourceBarProps {
    current: number;
    max: number;
    type: 'hp' | 'energy' | 'xp';
    label?: string;
    showValue?: boolean;
}

export const ResourceBar: React.FC<ResourceBarProps> = ({
    current,
    max,
    type,
    label,
    showValue = true
}) => {
    const [displayValue, setDisplayValue] = useState(current);
    const percentage = Math.min((current / max) * 100, 100);

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayValue(prev => {
                if (prev < current) return Math.min(prev + 1, current);
                if (prev > current) return Math.max(prev - 1, current);
                return prev;
            });
        }, 20);

        return () => clearInterval(interval);
    }, [current]);

    return (
        <div className={`${styles.container} ${styles[type]}`}>
            {label && <span className={styles.label}>{label}</span>}

            <div className={styles.barContainer}>
                <div className={styles.barBackground}>
                    <motion.div
                        className={styles.barFill}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />

                    <div className={styles.glassHighlight} />
                </div>

                {showValue && (
                    <span className={styles.value}>
                        {displayValue} / {max}
                    </span>
                )}
            </div>
        </div>
    );
};
