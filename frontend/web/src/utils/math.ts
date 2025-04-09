/**
 * 속도를 0~100 사이로 정규화
 */
export const normalizeSpeed = (value: number): number => {
  const min = 70;
  const max = 90;

  return normalize(value, min, max);
};

/**
 * 가속도를 0~100 사이로 정규화
 */
export const normalizeAcceleration = (value: number): number => {
  const min = 70;
  const max = 90;

  return normalize(value, min, max);
};

/**
 * 지구력을 0~100 사이로 정규화
 */
export const normalizeStamina = (value: number): number => {
  const min = 70;
  const max = 100;

  return normalize(value, min, max);
};

const normalize = (value: number, min: number, max: number) => {
  if (value < min) value = min;
  if (value > max) value = max;

  return ((value - min) / (max - min)) * 100;
};
