import { PayConfirmInfoType, PayInitInfoType } from '@/types/pay';

const { IMP } = window;
const { VITE_BASE_URL, VITE_PORTONE_CODE, VITE_PORTONE_CHANNEL } = import.meta.env;

export const payByPortone = ({ merchantUid, name, amount, orderedAt }: PayInitInfoType): PayConfirmInfoType => {
  IMP.init(VITE_PORTONE_CODE);

  return IMP.request_pay(
    {
      channelKey: VITE_PORTONE_CHANNEL,
      merchant_uid: merchantUid,
      name: name,
      amount: amount,
      orderedAt: orderedAt,
      m_redirect_url: `${VITE_BASE_URL}/payment-redirect`,
    },
    async (response) => {
      if (response.error_code != null) {
        return alert(`결제에 실패하였습니다. 에러 내용: ${response.error_msg}`);
      }

      const payConfirmInfo = {
        impUid: response.imp_uid,
        merchantUid: response.merchant_uid,
      };
      return payConfirmInfo;
    }
  );
};
