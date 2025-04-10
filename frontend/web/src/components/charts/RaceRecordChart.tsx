import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { raceRecordNameMap } from '@/constants/stall';
import { queryKey } from '@/constants/queryKey';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRaceRecord } from '@/services/stall';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
ChartJS.defaults.font.size = 10;
ChartJS.defaults.font.family = 'DungGeunMo';
ChartJS.defaults.color = 'white';

interface RaceRecordChartProps {
  cardId: number;
}

const RaceRecordChart: React.FC<RaceRecordChartProps> = ({ cardId }) => {
  const { data: raceRecord } = useSuspenseQuery({
    queryKey: [queryKey.RACE_RECORD, cardId],
    queryFn: () => getRaceRecord(cardId),
  });

  const chartData = {
    labels: Object.keys(raceRecord).map((key) => raceRecordNameMap[key as keyof typeof raceRecordNameMap]),
    datasets: [
      {
        label: '순위별 달성 횟수',
        data: Object.values(raceRecord),
        backgroundColor: ['#00aaff52', '#00FF2A52', '#ffea0052'],
        borderColor: ['#00AAFF', '#00FF2A', '#FFEA00'],
        borderWidth: 1,
      },
    ],
  };

  if (raceRecord.totalPrize === 0) {
    return <div className='flex w-full justify-center'>상위 등수 달성 내역이 없습니다.</div>;
  }

  return <Bar data={chartData} />;
};

export default RaceRecordChart;
