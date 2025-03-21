import { useState } from 'react';
import DownArrowIcon from '@/assets/icons/downArrowIcon.svg?react';
import DropdownList from '@/components/ui/dropdown/DropdownList';
import useClickOutsideRef from '@/hooks/useClickOutsideRef';

interface DropdownProps {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutsideRef<HTMLDivElement>(() => setIsOpen(false));

  const handleClickOption = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className='relative min-w-38' ref={ref}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className='flex w-full cursor-pointer items-center justify-between rounded-sm border border-black bg-white'
      >
        <p className='text-detail1 truncate pl-4 text-black'>{value || placeholder}</p>
        <div className='border-l border-black p-4'>
          <DownArrowIcon />
        </div>
      </button>
      {isOpen && <DropdownList options={options} onChange={handleClickOption} />}
    </div>
  );
};

export default Dropdown;
