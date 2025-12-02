import { motion } from 'framer-motion';
import styles from './WesternButton.module.css';

interface WesternButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    children: React.ReactNode;
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
        <motion.button
            className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            disabled={disabled}
            {...props}
        >
            <div className={styles.rivet} />
            <div className={styles.rivet} />
            {icon && <span className={styles.icon}>{icon}</span>}
            <span className={styles.label}>{children}</span>
        </motion.button>
    );
};
