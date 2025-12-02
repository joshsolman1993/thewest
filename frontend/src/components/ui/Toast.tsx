import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
    id,
    message,
    type,
    duration = 3000,
    onClose
}) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose(id);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [id, duration, onClose]);

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ⓘ'
    };

    return (
        <motion.div
            className={`${styles.toast} ${styles[type]}`}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={() => onClose(id)}
        >
            <span className={styles.icon}>{icons[type]}</span>
            <span className={styles.message}>{message}</span>
            <button
                className={styles.closeButton}
                onClick={() => onClose(id)}
                aria-label="Close notification"
            >
                ✕
            </button>
        </motion.div>
    );
};

// Toast Container
interface ToastContainerProps {
    toasts: Array<{
        id: string;
        message: string;
        type: ToastType;
        duration?: number;
    }>;
    onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
    return (
        <div className={styles.container}>
            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={onClose}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};
