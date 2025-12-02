import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WesternButton } from './WesternButton';
import styles from './Modal.module.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg';
    showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true
}) => {
    // ESC key to close
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className={styles.backdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <div className={styles.modalContainer}>
                        <motion.div
                            className={`${styles.modal} ${styles[size]}`}
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 50 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        >
                            {/* Gold border decoration */}
                            <div className={styles.border} />

                            {/* Header */}
                            {title && (
                                <div className={styles.header}>
                                    <h2 className={styles.title}>{title}</h2>
                                    {showCloseButton && (
                                        <button
                                            className={styles.closeButton}
                                            onClick={onClose}
                                            aria-label="Close modal"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Content */}
                            <div className={styles.content}>
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

// ConfirmDialog variant
interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary'
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" showCloseButton={false}>
            <p style={{
                marginBottom: 'var(--space-6)',
                lineHeight: 1.6,
                fontSize: '1rem'
            }}>
                {message}
            </p>

            <div style={{
                display: 'flex',
                gap: 'var(--space-3)',
                justifyContent: 'flex-end'
            }}>
                <WesternButton variant="secondary" onClick={onClose}>
                    {cancelText}
                </WesternButton>
                <WesternButton variant={variant} onClick={handleConfirm}>
                    {confirmText}
                </WesternButton>
            </div>
        </Modal>
    );
};
