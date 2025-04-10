import { useEffect, useState, useRef } from 'react';
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
  const { subscribe, publish, unsubscribeAll } = useStompClient();

  const [players, setPlayers] = useState<RoomJoinUserData[]>([]);
  const [raceUsers, setRaceUsers] = useState<RaceUser[]>([]);

  const [gameResult, setGameResult] = useState<ResultData['gameResult']>([
    { raceRank: 0, totalPrize: 0, userNickname: '', userId: 0 },
  ]);

  const [playersInfo, setPlayersInfo] = useState<RoomJoinUserData[]>([]);
  const [roomName, setRoomName] = useState<string>('');
  const [maxPlayers, setMaxPlayers] = useState<number>(6);
  const [roomId, setRoomId] = useState<number>(0);

  const navigate = useNavigate();
  const { ModalWrapper, openModal } = useModal();
  const [isOpen, setIsOpen] = useState(true);

  const keyDownRef = useRef<(e: KeyboardEvent) => void | null>(null);
  const touchStartRef = useRef<() => void | null>(null);
  const mouseDownRef = useRef<() => void | null>(null);

  const addEventListeners = (callback: () => void) => {
    keyDownRef.current = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.code === 'Space') && !e.repeat) {
        callback();
      }
    };
    touchStartRef.current = () => callback();
    mouseDownRef.current = () => callback();

    window.addEventListener('keydown', keyDownRef.current);
    window.addEventListener('touchstart', touchStartRef.current);
    window.addEventListener('mousedown', mouseDownRef.current);
  };

  const removeEventListeners = () => {
    if (keyDownRef.current) window.removeEventListener('keydown', keyDownRef.current);
    if (touchStartRef.current) window.removeEventListener('touchstart', touchStartRef.current);
    if (mouseDownRef.current) window.removeEventListener('mousedown', mouseDownRef.current);

    keyDownRef.current = null;
    touchStartRef.current = null;
    mouseDownRef.current = null;
  };

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
          removeEventListeners();
          openModal();
          setGameResult(data.gameResult);
          setPlayersInfo(data.playersInfo);
          setRoomName(data.roomName);
          setMaxPlayers(data.maxPlayers);
          setRoomId(data.roomId);
        } else {
          setRaceUsers(data.progress);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  useEffect(() => {
    if (!state?.roomId) return;
    const destination = `/app/race_room/${state.roomId}/game`;
    if (!waiting) {
      addEventListeners(() => publish(destination));
    }
    return () => {
      removeEventListeners();
    };
  }, [state?.roomId, publish, waiting]);

  useEffect(() => {
    if (!isOpen) {
      playersInfo?.forEach((player) => {
        if (player.userId === data?.id) {
          if (!player.hasEnoughCoin) {
            publish('/app/force_leave');
            unsubscribeAll();
            navigate('/racetrack', { replace: true });
          }
        }
      });

      navigate(`/racetrack/room/${roomId}?title=${roomName}`, {
        state: { playersInfo, isEnd: true, maxPlayers, roomId },
        replace: true,
      });
    }
  }, [isOpen]);

  return (
    <div className='flex h-dvh flex-col items-center justify-center'>
      <ModalWrapper>
        <RaceResult gameResult={gameResult} setIsOpen={setIsOpen} playersInfo={playersInfo} />
      </ModalWrapper>

      {waiting && <RaceWaiting color={data ? data.representativeCard.coatColor : 'black'} setWaiting={setWaiting} />}
      {!waiting && <Race players={players} user={data} info={raceUsers} />}
    </div>
  );
};

export default RaceTrackRacePage;
