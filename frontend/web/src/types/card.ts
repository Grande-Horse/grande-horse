import { HorseType } from '@/types/horse';

export interface HorseCardType extends HorseType {
  cardId: number;
  status: number;
}
