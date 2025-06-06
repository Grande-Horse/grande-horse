import { PriceHistoryType } from '@/types/trading';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
ChartJS.defaults.font.size = 10;
ChartJS.defaults.font.family = 'DungGeunMo';
ChartJS.defaults.color = 'white';

interface PriceLineChartProps {
  priceHistory: PriceHistoryType[];
}

const PriceLineChart: React.FC<PriceLineChartProps> = ({ priceHistory }) => {
  const chartData = {
    labels: priceHistory.map((history) => history.date),
    datasets: [
      {
        label: '평균가',
        data: priceHistory.map((history) => history.averagePrice ?? 0),
        borderColor: '#00AAFF',
        fill: false,
      },
      {
        label: '최고가',
        data: priceHistory.map((history) => history.highestPrice ?? 0), // highestPrice를 y축 데이터로 사용
        borderColor: '#00FF2A',
        fill: false,
      },
      {
        label: '최저가',
        data: priceHistory.map((history) => history.lowestPrice ?? 0), // lowestPrice를 y축 데이터로 사용
        borderColor: '#FFEA00',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className='flex h-full w-full items-center justify-center p-4'>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PriceLineChart;
