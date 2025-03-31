import { CustomError } from '@/types/service/error';

const A1: CustomError = {
  code: 'A1',
  message: '토큰이 유효하지 않습니다.',
};

const A2: CustomError = {
  code: 'A2',
  message: '블랙리스트에 등록된 유저입니다.',
};

const A3: CustomError = {
  code: 'A3',
  message: 'ID 토큰이 만료되었습니다.',
};

const U1: CustomError = {
  code: 'U1',
  message: '중복된 닉네임입니다.',
};

const C1: CustomError = {
  code: 'C1',
  message: '길이 제한을 초과하였습니다.',
};

const H1: CustomError = {
  code: 'H1',
  message: '존재하지 않는 말입니다.',
};

const H2: CustomError = {
  code: 'H2',
  message: '소유하지 않은 말입니다.',
};

const CA1: CustomError = {
  code: 'CA1',
  message: '소유한 말 카드가 아닙니다.',
};

const CA2: CustomError = {
  code: 'CA2',
  message: '판매할 수 없는 말 카드입니다.',
};

const CA3: CustomError = {
  code: 'CA3',
  message: '존재하지 않는 말 카드입니다.',
};

export const customError = {
  A1,
  A2,
  A3,
  U1,
  C1,
  H1,
  H2,
  CA1,
  CA2,
  CA3,
} as const;
