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

const rankNameMap = {
  노멀: 'normal',
  레어: 'rare',
  에픽: 'epic',
  유니크: 'unique',
  레전드: 'legend',
} as const;

export { rankTextColor, rankMap, rankNameMap };
