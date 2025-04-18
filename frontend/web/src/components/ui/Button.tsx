import { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'warning';
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, disabled, variant = 'primary', className = '', ...rest }, ref) => {
    const variants: Record<string, string> = {
      primary: 'text-white bg-primary text-stroke cursor-pointer',
      secondary: 'text-black bg-secondary cursor-pointer',
      warning: 'text-white bg-warning text-stroke cursor-pointer',
      disabled: 'text-darkgray bg-gray border-darkgray cursor-not-allowed',
    } as const;

    const currentStyle = disabled ? variants.disabled : variants[variant];

    return (
      <button
        ref={ref}
        className={`rounded-sm border border-black px-4 py-2 ${currentStyle} ${className}`}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
