export interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'warning';
}

export const MenuButton: React.FC<MenuButtonProps> = ({ children, disabled, variant = 'primary' }: MenuButtonProps) => {
  const variants: Record<string, string> = {
    secondary: 'text-white bg-secondary text-stroke cursor-pointer',
    warning: 'text-white bg-warning text-stroke cursor-pointer',
    disabled: 'text-darkgray bg-gray border-darkgray cursor-not-allowed',
  } as const;

  const currentStyle = disabled ? variants.disabled : variants[variant];

  return (
    <button
      className={`items-center justify-center rounded-sm border border-black px-16 py-4 ${currentStyle}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
