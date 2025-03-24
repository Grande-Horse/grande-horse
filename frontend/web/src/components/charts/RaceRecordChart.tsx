import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { RaceRecordType } from '@/types/race';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
ChartJS.defaults.font.size = 10;
ChartJS.defaults.font.family = 'DungGeunMo';
ChartJS.defaults.color = 'white';

interface RaceRecordChartProps {
  raceRecord: RaceRecordType;
}

const RaceRecordChart: React.FC<RaceRecordChartProps> = ({ raceRecord }) => {
  const chartData = {
    labels: Object.keys(raceRecord),
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

  return <Bar data={chartData} />;
};

export default RaceRecordChart;
