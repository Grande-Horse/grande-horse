import { CustomError } from '@/types/service/error';

const A1: CustomError = {
  code: 'A1',
  message: '유효하지 않은 토큰이거나 토큰이 존재하지 않습니다.',
};

const A2: CustomError = {
  code: 'A2',
  message: '블랙리스트에 등록된 유저입니다.',
};

const A3: CustomError = {
  code: 'A3',
  message: 'ID 토큰 유효 기간이 만료되었습니다.',
};

const U1: CustomError = {
  code: 'U1',
  message: '중복된 닉네임입니다.',
};

const U2: CustomError = {
  code: 'U2',
  message: '유저의 코인이 부족합니다.',
};

const U3: CustomError = {
  code: 'U3',
  message: '존재하지 않는 유저입니다.',
};

const C1: CustomError = {
  code: 'C1',
  message: '입력할 수 있는 글자 길이를 초과하였습니다.',
};

const H1: CustomError = {
  code: 'H1',
  message: '존재하지 않는 말입니다.',
};

const H2: CustomError = {
  code: 'H2',
  message: '해당 등급의 말이 존재하지 않습니다.',
};

const CA1: CustomError = {
  code: 'CA1',
  message: '유저의 말 카드가 아닙니다.',
};

const CA2: CustomError = {
  code: 'CA2',
  message: '판매할 수 없는 말 카드입니다.',
};

const CA3: CustomError = {
  code: 'CA3',
  message: '존재하지 않는 말 카드입니다.',
};

const CA4: CustomError = {
  code: 'CA4',
  message: '출전마가 될 수 없는 카드입니다.',
};

const CA5: CustomError = {
  code: 'CA5',
  message: '후보 말로 등록 또는 해제할 수 없는 카드입니다.',
};

const CA6: CustomError = {
  code: 'CA6',
  message: '출전마 및 후보 말은 최대 6마리까지 등록할 수 있습니다.',
};

const CA7: CustomError = {
  code: 'CA7',
  message: '합성을 위해 3장의 카드가 필요합니다.',
};

const CA8: CustomError = {
  code: 'CA8',
  message: '합성에 사용하지 못하는 카드가 포함되어 있습니다.',
};

const CA9: CustomError = {
  code: 'CA9',
  message: '합성에 사용하는 카드는 모두 같은 등급이어야 합니다.',
};

const CA10: CustomError = {
  code: 'CA10',
  message: '합성할 수 없는 카드 등급입니다.',
};

const CA11: CustomError = {
  code: 'CA11',
  message: '조회할 수 없는 카드 등급입니다.',
};

const CA12: CustomError = {
  code: 'CA12',
  message: '출전마로 등록된 말이 없습니다.',
};

const T1: CustomError = {
  code: 'T1',
  message: '판매 중인 말 카드가 아닙니다.',
};

const T2: CustomError = {
  code: 'T2',
  message: '자신의 카드를 구매할 수 없습니다.',
};

const T3: CustomError = {
  code: 'T3',
  message: '거래 취소에 대한 권한이 없습니다.',
};

const P1: CustomError = {
  code: 'P1',
  message: '존재하지 않는 상품입니다.',
};

const P2: CustomError = {
  code: 'P2',
  message: '현재 판매 중인 상품이 아닙니다.',
};

const P3: CustomError = {
  code: 'P3',
  message: '카드팩에 대한 확률이 정의되지 않았습니다.',
};

const P4: CustomError = {
  code: 'P4',
  message: '카드팩에 대한 확률이 잘못 정의되어 있습니다.',
};

const PC1: CustomError = {
  code: 'PC1',
  message: '구매 요청이 만료되었습니다.',
};

const PC2: CustomError = {
  code: 'PC2',
  message: '결제는 완료되었지만 구매 요청 정보가 없습니다.',
};

const PC3: CustomError = {
  code: 'PC3',
  message: '유효하지 않은 결제입니다.',
};

const PC4: CustomError = {
  code: 'PC4',
  message: '이미 처리된 구매 요청입니다.',
};

const PC5: CustomError = {
  code: 'PC5',
  message: '결제 금액이 일치하지 않습니다.',
};

const PC6: CustomError = {
  code: 'PC6',
  message: '오늘은 이미 데일리 카드팩을 구매하셨습니다.',
};

const PC7: CustomError = {
  code: 'PC7',
  message: '보유한 코인이 부족하여 구매할 수 없습니다.',
};

const R1: CustomError = {
  code: 'R1',
  message: '존재하지 않는 경마방입니다.',
};

const R2: CustomError = {
  code: 'R2',
  message: '중복된 경마방입니다.',
};

const R3: CustomError = {
  code: 'R3',
  message: '경마방의 최대 인원을 초과하였습니다.',
};

const R4: CustomError = {
  code: 'R4',
  message: '방장만 게임을 시작할 수 있습니다.',
};

const R5: CustomError = {
  code: 'R5',
  message: '모든 유저가 준비하지 않았습니다.',
};

const R6: CustomError = {
  code: 'R6',
  message: '이미 경주가 시작된 방입니다.',
};

const R7: CustomError = {
  code: 'R7',
  message: '방장이 아닙니다.',
};

const R8: CustomError = {
  code: 'R8',
  message: '이미 경마방에 존재하는 유저입니다.',
};

const R9: CustomError = {
  code: 'R9',
  message: '코인이 부족하여 방에 참가할 수 없습니다.',
};

const R10: CustomError = {
  code: 'R10',
  message: '출전마가 설정되어 있지 않습니다.',
};

const E1: CustomError = {
  code: 'E1',
  message: '외부 API 응답 처리 중 오류가 발생했습니다.',
};

const E2: CustomError = {
  code: 'E2',
  message: '결제 정보 조회 중 오류가 발생했습니다.',
};

const E3: CustomError = {
  code: 'E3',
  message: '결제 취소에 실패하였습니다.',
};

export const customError = {
  A1,
  A2,
  A3,
  U1,
  U2,
  U3,
  C1,
  H1,
  H2,
  CA1,
  CA2,
  CA3,
  CA4,
  CA5,
  CA6,
  CA7,
  CA8,
  CA9,
  CA10,
  CA11,
  CA12,
  T1,
  T2,
  T3,
  P1,
  P2,
  P3,
  P4,
  PC1,
  PC2,
  PC3,
  PC4,
  PC5,
  PC6,
  PC7,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  R9,
  R10,
  E1,
  E2,
  E3,
} as const;
