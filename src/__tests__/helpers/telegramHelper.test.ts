import { describe, expect, test, afterEach, jest } from 'bun:test';

import { emptyTelegramUser, fullTelegramUser } from '../mocks/telegramUsers';
import { checkTgAuthorization } from 'helpers/telegramHelper';

describe('Telegram helper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkTgAuthorization', () => {
    test('should return true on real hash', () => {
      const result = checkTgAuthorization(fullTelegramUser);

      expect(result).toBe(true);
    });

    test('should return false on strange hash', () => {
      const result = checkTgAuthorization({
        ...fullTelegramUser,
        hash: 'somefakehashsoitfails',
      });

      expect(result).toBe(false);
    });

    test('should return true without some fields', () => {
      const result = checkTgAuthorization(emptyTelegramUser);

      expect(result).toBe(true);
    });

    test('should return true with null on some fields', () => {
      const result = checkTgAuthorization({
        ...emptyTelegramUser,
        first_name: null,
        last_name: null,
        photo_url: null,
      });

      expect(result).toBe(true);
    });
  });
});
