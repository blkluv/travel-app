import cx from 'classnames';
import React from 'react';
import './style';

export enum EColors {
    BLUE = 'blue',
    GREEN = 'green',
    YELLOW = 'yellow',
    RED = 'red'
}

interface IProps {
    className?: string;
    label?: string;
    type?: 'submit' | undefined;
    color?: EColors;
    isDisabled?: boolean;
    onClick: (e: React.FormEvent) => void;
    children?: React.ReactNode;
}

const Button = ({ label, type, color, isDisabled, onClick, className }: IProps) => (
    <button
        className={cx(className, { 'is-disabled': isDisabled }, color)}
        type={type || 'button'}
        onClick={isDisabled ? () => null : onClick}
        data-component="Button"
    >
        {label}
    </button>
)

export const ButtonWithIcon = ({ label, icon, type, color, isDisabled, onClick, className }: IProps & { icon: string }) => (
    <button
        className={cx(className, { 'is-disabled': isDisabled })}
        type={type || 'button'}
        onClick={isDisabled ? () => null : onClick}
        data-component="ButtonWithIcon"
    >
        <div className={cx('icon', color)}>
            {icon}
        </div>

        {label && (
            <p className="label">
                {label}
            </p>
        )}
    </button>
)

export default Button;
