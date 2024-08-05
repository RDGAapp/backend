import { mock } from 'bun:test';

process.env.TZ = 'UTC';
process.env.TG_BOT_TOKEN = 'jest-tg-token';
process.env.BITRIX_URL = 'test-bitrix-url';

mock.module('helpers/logger', () => ({
  default: {
    info: mock(),
    error: mock(),
    warn: mock(),
    debug: mock(),
  },
}));
