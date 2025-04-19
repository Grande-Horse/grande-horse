import { type CoatColorType } from '@/types/horse';

export default interface UserInfoData {
  id: number;
  nickname: string;
  coin: number;
  representativeCard: {
    cardId: number;
    horseId: string;
    status: number;
    coatColor: CoatColorType;
    name: string;
    horseRank: 'normal' | 'rare' | 'epic' | 'unique' | 'legend';
    weight: number;
    speed: number;
    acceleration: number;
    stamina: number;
  };
}
