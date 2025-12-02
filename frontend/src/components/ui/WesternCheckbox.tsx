import { InputHTMLAttributes } from 'react';
import styles from './WesternCheckbox.module.css';

interface WesternCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string;
}

export const WesternCheckbox: React.FC<WesternCheckboxProps> = ({
    label,
    className = '',
    ...props
}) => {
    return (
        <label className={`${styles.container} ${className}`}>
            <input
                type="checkbox"
                className={styles.input}
                {...props}
            />
            <span className={styles.checkmark} />
            <span className={styles.label}>{label}</span>
        </label>
    );
};
