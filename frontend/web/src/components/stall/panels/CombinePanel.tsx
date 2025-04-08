import SmallHorseCard from '@/components/cards/SmallHorseCard';
import EmptyCard from '@/components/stall/items/EmptyCard';
import CardList from '@/components/stall/list/CardList';
import { Button } from '@/components/ui/Button';
import Dropdown from '@/components/ui/dropdown/Dropdown';
import ErrorBoundary from '@/components/ui/errorBoundary/ErrorBoundary';
import Loading from '@/components/ui/Loading';
import { rankMap, rankNameMap } from '@/constants/rank';
import { HorseCardType } from '@/types/card';
import { Suspense, useEffect, useState } from 'react';
import Error from '@/components/ui/Error';
import { combineCards } from '@/services/stall';
import CombineResult from '@/components/stall/CombineResult';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKey } from '@/constants/queryKey';

const MAX_COMBINE_NUM = 3;

const CombinePanel: React.FC = () => {
  const [rank, setRank] = useState<string>('');
  const [selectedHorses, setSelectedHorses] = useState<HorseCardType[]>([]);
  const [newCard, setNewCard] = useState<HorseCardType | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (cardIds: number[]) => combineCards(cardIds),
    onSuccess: (data) => {
      queryClient.refetchQueries({ queryKey: [queryKey.MY_HORSE_CARDS] });
      setSelectedHorses([]);
      setNewCard(data);
    },
  });

  const handleAddCard = (horse: HorseCardType) => {
    if (selectedHorses.length === 3) {
      alert('카드를 더이상 선택할 수 없습니다.\n기존에 선택된 카드를 제거해 주세요.');
      return;
    }

    if (selectedHorses.find((sHorse) => sHorse.cardId === horse.cardId)) {
      alert('같은 카드를 더이상 선택할 수 없습니다.');
      return;
    }

    if (selectedHorses.find((sHorse) => sHorse.horseRank !== horse.horseRank)) {
      alert('같은 등급의 카드로 합성할 수 있습니다.');
      return;
    }

    setSelectedHorses((prev) => [...prev, horse]);
  };

  const handleRemoveCard = (horse: HorseCardType) => {
    setSelectedHorses((prev) => prev.filter((sHorse) => sHorse.cardId !== horse.cardId));
  };

  const handleCombine = async () => {
    const cardIds = selectedHorses.map((horse) => horse.cardId);
    mutation.mutate(cardIds);
  };

  useEffect(() => {
    if (newCard?.cardId === -1) {
      setSelectedHorses([]);
      alert('합성에 실패하였습니다 T-T');
    }
  }, [newCard]);

  return (
    <div className='flex h-full flex-col divide-y divide-black'>
      {newCard && newCard.cardId !== -1 && <CombineResult horseCard={newCard} onClick={() => setNewCard(null)} />}

      <section className='flex w-full flex-col py-4'>
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
          className='mt-3 mb-2 w-40 self-center'
        >
          합성
        </Button>
      </section>

      <section className='bg-primary p-4'>
        <Dropdown options={Object.values(rankMap)} value={rank} onChange={setRank} placeholder='전체' />
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
