import { InputHTMLAttributes } from 'react';
import styles from './WesternInput.module.css';

interface WesternInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const WesternInput: React.FC<WesternInputProps> = ({
    label,
    error,
    helperText,
    className = '',
    ...props
}) => {
    return (
        <div className={`${styles.container} ${className}`}>
            {label && (
                <label className={styles.label}>
                    {label}
                    {props.required && <span className={styles.required}>*</span>}
                </label>
            )}

            <div className={styles.inputWrapper}>
                <input
                    className={`${styles.input} ${error ? styles.error : ''}`}
                    {...props}
                />
            </div>

            {error && (
                <span className={styles.errorText}>{error}</span>
            )}

            {helperText && !error && (
                <span className={styles.helperText}>{helperText}</span>
            )}
        </div>
    );
};
