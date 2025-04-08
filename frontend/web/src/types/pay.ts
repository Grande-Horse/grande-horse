export interface PayInitInfoType {
  merchantUid: string;
  name: string;
  amount: number;
  orderedAt: string;
}

export interface PayConfirmInfoType {
  impUid: string;
  merchantUid: string;
}
