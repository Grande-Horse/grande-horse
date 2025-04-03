import SmallHorseCard from '@/components/cards/SmallHorseCard';
import EmptyCard from '@/components/stall/items/EmptyCard';
import CardList from '@/components/stall/list/CardList';
import { Button } from '@/components/ui/Button';
import Dropdown from '@/components/ui/dropdown/Dropdown';
import ErrorBoundary from '@/components/ui/errorBoundary/ErrorBoundary';
import Loading from '@/components/ui/Loading';
import { rankMap, rankNameMap } from '@/constants/rank';
import { HorseCardType } from '@/types/card';
import { Suspense, useState } from 'react';
import Error from '@/components/ui/Error';

const MAX_COMBINE_NUM = 3;

const CombinePanel: React.FC = () => {
  const [rank, setRank] = useState<string>('');
  const [selectedHorses, setSelectedHorses] = useState<HorseCardType[]>([]);

  const handleAddCard = (horse: HorseCardType) => {
    if (selectedHorses.length === 3) {
      alert('카드를 더이상 선택할 수 없습니다.\n기존에 선택된 카드를 제거해 주세요.');
      return;
    }

    if (selectedHorses.find((sHorse) => sHorse.cardId === horse.cardId)) {
      alert('같은 카드를 더이상 선택할 수 없습니다.');
      return;
    }

    setSelectedHorses((prev) => [...prev, horse]);
  };

  const handleRemoveCard = (horse: HorseCardType) => {
    setSelectedHorses((prev) => prev.filter((sHorse) => sHorse.cardId !== horse.cardId));
  };

  const handleCombine = () => {
    // TODO: 합성 API 요청
  };

  return (
    <div className='flex h-full flex-col divide-y divide-black'>
      <section className='flex w-full flex-col'>
        <div className='grid grid-cols-3 place-items-center px-1 py-2'>
          {selectedHorses.map((horse) => (
            <SmallHorseCard horse={horse} onClick={handleRemoveCard} />
          ))}

          {Array.from({ length: MAX_COMBINE_NUM - selectedHorses.length }).map(() => (
            <EmptyCard />
          ))}
        </div>

        <Button
          onClick={handleCombine}
          disabled={selectedHorses.length !== MAX_COMBINE_NUM}
          className='mt-3 mb-6 w-40 self-center'
        >
          합성
        </Button>
      </section>

      <section className='bg-primary p-4'>
        <Dropdown options={Object.values(rankMap)} value={rank} onChange={setRank} placeholder='등급 선택' />
      </section>

      <ErrorBoundary renderFallback={(error) => <Error errorMessage={error?.message} />}>
        <Suspense fallback={<Loading />}>
          <CardList rank={rankNameMap[rank as keyof typeof rankNameMap]} onClick={handleAddCard} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default CombinePanel;
