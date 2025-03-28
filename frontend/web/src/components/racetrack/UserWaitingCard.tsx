const UserWaitingCard: React.FC = () => {
  return (
    <div
      className={`text-stroke shadow-primary flex flex-col items-center justify-between rounded-2xl bg-white/10 px-4 py-6 shadow-xs`}
    >
      <p className='flex h-11 w-full items-center justify-center rounded-xl shadow-inner shadow-black/20'></p>
      <div className='text-body2 flex w-full justify-center'>
        대기 중
        <DotAnimation />
      </div>
    </div>
  );
};

export default UserWaitingCard;

const DotAnimation = () => {
  return <div className='dot-animation'></div>;
};
