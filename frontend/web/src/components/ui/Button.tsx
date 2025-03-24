export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'warning';
}

export const Button: React.FC<ButtonProps> = ({ children, disabled, variant = 'primary', ...rest }: ButtonProps) => {
  const variants: Record<string, string> = {
    primary: 'text-white bg-primary text-stroke cursor-pointer',
    secondary: 'text-white bg-secondary text-stroke cursor-pointer',
    warning: 'text-white bg-warning text-stroke cursor-pointer',
    disabled: 'text-darkgray bg-gray border-darkgray cursor-not-allowed',
  } as const;

  const currentStyle = disabled ? variants.disabled : variants[variant];

  return (
    <button
      className={`items-center justify-center rounded-sm border border-black px-4 py-2 ${currentStyle}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
