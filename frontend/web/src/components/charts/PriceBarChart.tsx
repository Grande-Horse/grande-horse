import { PriceHistoryType } from '@/types/trading';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
ChartJS.defaults.font.size = 10;
ChartJS.defaults.font.family = 'DungGeunMo';
ChartJS.defaults.color = 'white';

interface PriceBarChartProps {
  priceHistory: PriceHistoryType[];
}

const PriceBarChart: React.FC<PriceBarChartProps> = ({ priceHistory }) => {
  const labels = priceHistory.map((history) => history.date);

  const averagePriceData = priceHistory.map((history) => history.averagePrice);
  const highestPriceData = priceHistory.map((history) => history.highestPrice);
  const lowestPriceData = priceHistory.map((history) => history.lowestPrice);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: '평균가',
        data: averagePriceData,
        backgroundColor: '#00aaff52',
        borderColor: '#00AAFF',
        borderWidth: 1,
      },
      {
        label: '최고가',
        data: highestPriceData,
        backgroundColor: '#00FF2A52',
        borderColor: '#00FF2A',
        borderWidth: 1,
      },
      {
        label: '최저가',
        data: lowestPriceData,
        backgroundColor: '#ffea0052',
        borderColor: '#FFEA00',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className='h-full w-full px-4'>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PriceBarChart;
