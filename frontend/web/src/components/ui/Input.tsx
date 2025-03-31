import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className, ...rest }) => {
  return (
    <div className='flex w-full items-center'>
      <input
        id={rest.id || 'input'}
        className={`w-full min-w-38 rounded-sm border border-black bg-white p-3 px-4 text-black focus:outline-none ${className}`}
        {...rest}
      />
    </div>
  );
};

export default Input;
