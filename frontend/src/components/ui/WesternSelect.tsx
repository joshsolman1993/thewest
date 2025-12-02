import { SelectHTMLAttributes } from 'react';
import styles from './WesternSelect.module.css';

interface WesternSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const WesternSelect: React.FC<WesternSelectProps> = ({
    label,
    error,
    options,
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

            <div className={styles.selectWrapper}>
                <select
                    className={`${styles.select} ${error ? styles.error : ''}`}
                    {...props}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <span className={styles.arrow}>▼</span>
            </div>

            {error && (
                <span className={styles.errorText}>{error}</span>
            )}
        </div>
    );
};
