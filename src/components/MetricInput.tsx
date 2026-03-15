import React from 'react';
import styles from './MetricInput.module.css';

interface FieldProps {
    label: string;
    children: React.ReactNode;
    hint?: string;
}

export const Field: React.FC<FieldProps> = ({ label, children, hint }) => (
    <div className={styles.field}>
        <label className={styles.label}>{label}</label>
        {children}
        {hint && <div className={styles.hint}>{hint}</div>}
    </div>
);

interface CheckboxProps {
    checked: boolean;
    onChange: () => void;
    label: string;
    detail?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, detail }) => (
    <label className={`${styles.checkbox} ${checked ? styles.checked : ''}`}>
        <input type="checkbox" checked={checked} onChange={onChange} className={styles.checkboxInput} />
        <div className={styles.checkboxContent}>
            <div className={styles.checkboxLabel}>{label}</div>
            {detail && <div className={styles.checkboxDetail}>{detail}</div>}
        </div>
    </label>
);

interface SelectProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ value, onChange, options }) => (
    <select value={value} onChange={onChange} className={styles.select}>
        {options.map((o) => (
            <option key={o.value} value={o.value}>
                {o.label}
            </option>
        ))}
    </select>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input: React.FC<InputProps> = (props) => (
    <input className={styles.input} {...props} />
);

interface RadioGroupProps {
    value: string;
    onChange: (val: string) => void;
    name: string;
    options: { value: string; label: string }[];
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ value, onChange, name, options }) => (
    <div className={styles.radioGroup}>
        {options.map((o) => (
            <label
                key={o.value}
                className={`${styles.radioLabel} ${value === o.value ? styles.radioSelected : ''}`}
            >
                <input
                    type="radio"
                    name={name}
                    value={o.value}
                    checked={value === o.value}
                    onChange={() => onChange(o.value)}
                    className={styles.radioInput}
                />
                {o.label}
            </label>
        ))}
    </div>
);

interface ScoreBarProps {
    label: string;
    value: number;
    max: number;
    color: string;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({ label, value, max, color }) => (
    <div className={styles.scoreBarContainer}>
        <div className={styles.scoreBarHeader}>
            <span>{label}</span>
            <span style={{ color }}>{value}/{max}</span>
        </div>
        <div className={styles.scoreBarTrack}>
            <div
                className={styles.scoreBarFill}
                style={{
                    width: `${max > 0 ? (value / max) * 100 : 0}%`,
                    backgroundColor: color,
                }}
            />
        </div>
    </div>
);

interface BoxProps {
    children: React.ReactNode;
    bg?: string;
    border?: string;
    style?: React.CSSProperties;
}

export const Box: React.FC<BoxProps> = ({ children, bg, border, style }) => (
    <div
        className={styles.box}
        style={{
            backgroundColor: bg,
            borderColor: border,
            ...style,
        }}
    >
        {children}
    </div>
);
