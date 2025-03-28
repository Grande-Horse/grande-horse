import { handlers as tradingHandlers } from '@/mocks/handlers/trading';
import { handlers as authHandlers } from '@/mocks/handlers/auth';

export const handlers = [...tradingHandlers, ...authHandlers];
