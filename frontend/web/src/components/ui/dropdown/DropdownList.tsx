interface DropdownListProps {
  options: readonly string[];
  onChange: (value: string) => void;
}

const DropdownList: React.FC<DropdownListProps> = ({ options, onChange }) => {
  return (
    <ul className='text-detail1 absolute top-16 w-full cursor-pointer divide-y rounded-sm border border-black bg-white'>
      {options.map((option) => (
        <li key={option} onClick={() => onChange(option)} className='p-4 text-black hover:bg-black/5'>
          {option}
        </li>
      ))}
    </ul>
  );
};

export default DropdownList;
