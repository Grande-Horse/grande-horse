import CoinAdIcon from '@/assets/icons/coinAdIcon.svg?react';
import CoinFootIcon from '@/assets/icons/coinFootIcon.svg?react';
import CoinCashIcon from '@/assets/icons/coinCashIcon.svg?react';
import CoinCashIcon2 from '@/assets/icons/coinCashIcon2.svg?react';
import CoinCashIcon3 from '@/assets/icons/coinCashIcon3.svg?react';
import { Button } from '@/components/ui/Button';
import { payByPortone } from '@/services/portone/payService';
import { initCashPay } from '@/services/coin';
import { PayInitInfoType } from '@/types/pay';

const CoinPanel: React.FC = () => {
  const handlePayButtonClick = async (coinId: number) => {
    const payInitInfo: PayInitInfoType = await initCashPay(coinId);
    payByPortone(payInitInfo);
  };

  return (
    <div className='flex flex-col divide-y divide-black'>
      <div className='flex gap-8 px-8 py-6'>
        <div className='bg-primary flex h-40 w-40 rounded-sm'>
          <CoinAdIcon width={60} className='translate-x-11 translate-y-9' />
        </div>
        <div className='flex h-40 grow flex-col justify-center gap-3.5 pt-1.5'>
          <p className='text-stroke'>100코인</p>
          <p className='text-stroke'>광고</p>
          <Button className='self-end px-12'>시청</Button>
        </div>
      </div>

      <div className='flex gap-8 px-8 py-6'>
        <div className='bg-primary flex h-40 w-40 rounded-sm'>
          <CoinFootIcon width={60} className='translate-x-11 translate-y-9' />
        </div>
        <div className='flex h-40 grow flex-col justify-center gap-3.5 pt-1.5'>
          <p className='text-stroke'>100코인</p>
          <p className='text-stroke'>1000걸음</p>
          <Button className='self-end px-12'>교환</Button>
        </div>
      </div>

      <div className='flex gap-8 px-8 py-6'>
        <div className='bg-primary flex h-40 w-40 rounded-sm'>
          <CoinCashIcon width={60} className='translate-x-11 translate-y-9' />
        </div>
        <div className='flex h-40 grow flex-col justify-center gap-3.5 pt-1.5'>
          <p className='text-stroke'>500코인</p>
          <p className='text-stroke'>500원</p>
          <Button onClick={() => handlePayButtonClick(1)} className='self-end px-12'>
            충전
          </Button>
        </div>
      </div>

      <div className='flex gap-8 px-8 py-6'>
        <div className='bg-primary flex h-40 w-40 rounded-sm'>
          <CoinCashIcon2 width={70} className='translate-x-9 translate-y-9' />
        </div>
        <div className='flex h-40 grow flex-col justify-center gap-3.5 pt-1.5'>
          <p className='text-stroke'>2500코인</p>
          <p className='text-stroke'>2500원</p>
          <Button onClick={() => handlePayButtonClick(2)} className='self-end px-12'>
            충전
          </Button>
        </div>
      </div>

      <div className='flex gap-8 px-8 py-6'>
        <div className='bg-primary flex h-40 w-40 rounded-sm'>
          <CoinCashIcon3 width={80} className='translate-x-7 translate-y-9' />
        </div>
        <div className='flex h-40 grow flex-col justify-center gap-3.5 pt-1.5'>
          <p className='text-stroke'>5000코인</p>
          <p className='text-stroke'>5000원</p>
          <Button onClick={() => handlePayButtonClick(3)} className='self-end px-12'>
            충전
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoinPanel;
