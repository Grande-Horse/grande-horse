import React from 'react';
import { MenuButton } from './Button';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  variant?: 'default' | 'button';
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

const Input: React.FC<InputProps> = ({ label, className, variant = 'default', ...rest }) => {
  return (
    <form>
      <div className='flex flex-col'>
        {label && (
          <label htmlFor={rest.id || 'input'} className='mb-2 text-sm font-medium text-gray-700'>
            {label}
          </label>
        )}

        <div className='flex items-center gap-4'>
          <input
            id={rest.id || 'input'}
            className={`w-full min-w-38 items-center justify-between rounded-sm border border-black bg-white p-4 text-black focus:outline-none ${className}`}
            {...rest}
          />
          {variant === 'button' && <MenuButton>Submit</MenuButton>}
        </div>
      </div>
    </form>
  );
};

export default Input;
