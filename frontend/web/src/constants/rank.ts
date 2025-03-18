const rankColor = {
  common: 'text-common',
  rare: 'text-rare',
  epic: 'text-epic',
  unique: 'text-unique',
  legend: 'text-legend',
} as const;

const rankName = {
  common: '노말',
  rare: '레어',
  epic: '에픽',
  unique: '유니크',
  legend: '레전드',
} as const;

export { rankColor, rankName };
