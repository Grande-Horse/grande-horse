const rankTextColor = {
  normal: 'text-normal',
  rare: 'text-rare',
  epic: 'text-epic',
  unique: 'text-unique',
  legend: 'text-legend',
} as const;

const rankMap = {
  normal: '노멀',
  rare: '레어',
  epic: '에픽',
  unique: '유니크',
  legend: '레전드',
} as const;

export { rankTextColor, rankMap };
