import { motion } from 'framer-motion';
import styles from './ParchmentPanel.module.css';

interface ParchmentPanelProps {
    title?: string;
    seal?: boolean;
    children: React.ReactNode;
    className?: string;
}

export const ParchmentPanel: React.FC<ParchmentPanelProps> = ({
    title,
    seal = false,
    children,
    className = ''
}) => {
    return (
        <motion.div
            className={`${styles.panel} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className={styles.border} />

            {title && (
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    {seal && (
                        <div className={styles.seal}>
                            <span className={styles.sealStar}>★</span>
                        </div>
                    )}
                </div>
            )}

            <div className={styles.content}>
                {children}
            </div>
        </motion.div>
    );
};
