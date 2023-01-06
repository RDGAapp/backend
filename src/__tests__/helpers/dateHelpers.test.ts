import { getMonday } from 'helpers/dateHelpers';

describe('Date Helpers', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('getMonday', () => {
    test('should return monday', () => {
      expect(getMonday(new Date()).toISOString()).toEqual(
        '2019-12-30T00:00:00.000Z',
      );
    });
  });
});
