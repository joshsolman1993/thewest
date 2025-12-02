import { type ReactNode } from 'react';
import styles from './WesternButton.module.css';

interface WesternButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    icon?: ReactNode;
    children: ReactNode;
}

export const WesternButton: React.FC<WesternButtonProps> = ({
    variant = 'primary',
    size = 'md',
    icon,
    children,
    className = '',
    disabled,
    ...props
}) => {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
            disabled={disabled}
            {...props}
        >
            <div className={styles.rivet} />
            <div className={styles.rivet} />
            {icon && <span className={styles.icon}>{icon}</span>}
            <span className={styles.label}>{children}</span>
        </button>
    );
};
