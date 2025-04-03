import { handlers as tradingHandlers } from '@/mocks/handlers/trading';
import { handlers as authHandlers } from '@/mocks/handlers/auth';
import { handlers as stallHandlers } from '@/mocks/handlers/stall';

export const handlers = [...tradingHandlers, ...authHandlers, ...stallHandlers];
