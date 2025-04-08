import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStompClient } from '@/contexts/StompContext';
import useUserInfo from '@/hooks/useQueries/useUserInfo';
import { type ResultData, type GameData, type RaceUser } from '@/types/race';
import { type RoomJoinUserData } from '@/types/room';
import useModal from '@/components/ui/modal/useModal';
import Race from '@/components/racetrack/Race';
import RaceWaiting from '@/components/racetrack/RaceWaiting';
import RaceResult from '@/components/racetrack/RaceResult';

interface StateType {
  roomId: number;
  playsers: RoomJoinUserData[];
}

const RaceTrackRacePage = () => {
  const [waiting, setWaiting] = useState(true);
  const { state } = useLocation() as { state: StateType };
  const { data } = useUserInfo();
  const { subscribe, publish } = useStompClient();

  const [players, setPlayers] = useState<RoomJoinUserData[]>([]);
  const [raceUsers, setRaceUsers] = useState<RaceUser[]>([]);

  const [gameResult, setGameResult] = useState<ResultData['gameResult']>([
    { raceRank: 0, totalPrize: 0, userNickname: '' },
  ]);

  const navigate = useNavigate();
  const { ModalWrapper, openModal } = useModal();

  useEffect(() => {
    if (!state) {
      return;
    }
    const roomId = state.roomId;
    const players = state.playsers;

    setPlayers(players);

    subscribe(
      `/topic/race_room/${roomId}/game`,
      (data: GameData) => {
        if (data.type === 'resultData') {
          openModal();
          setGameResult(data.gameResult);
          // navigate(`/racetrack/room/${roomId}/`, { state: { roomId, gameResult: data.gameResult } });
        } else {
          setRaceUsers(data.progress);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }, [state, data]);

  useEffect(() => {
    if (!state) {
      return;
    }
    const roomId = state.roomId;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        publish(`/app/race_room/${roomId}/game`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className='flex h-dvh flex-col items-center justify-center'>
      <ModalWrapper>
        <RaceResult gameResult={gameResult} />
      </ModalWrapper>
      {waiting && <RaceWaiting color={data ? data.representativeCard.coatColor : 'black'} setWaiting={setWaiting} />}
      {!waiting && <Race players={players} user={data} info={raceUsers} />}
    </div>
  );
};

export default RaceTrackRacePage;
