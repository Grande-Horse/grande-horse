const UserRestrictedCard: React.FC = () => {
  return (
    <div className='flex flex-col items-center justify-center rounded-2xl bg-black/20 shadow-inner shadow-black/10'>
      <div className='relative flex h-full w-full flex-col items-center justify-center'>
        <div className='bg-background absolute h-40 w-10 rotate-135 border-2 border-black/10'></div>
        <div className='bg-background absolute h-40 w-10 rotate-45 border-2 border-black/10'></div>
      </div>
    </div>
  );
};

export default UserRestrictedCard;
