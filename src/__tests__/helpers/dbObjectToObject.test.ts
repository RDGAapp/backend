import { describe, expect, test } from 'bun:test';

import dbObjectToObject from 'helpers/dbObjectToObject';

describe('Helper function dbObjectToObject', () => {
  const mapping = {
    harry: 'potter',
    ron: 'weasley',
    ginny: 'weasley_potter',
    muggle: 'shwuggle',
  } as const;

  const fullObject = {
    potter: 'wizard',
    weasley: 'friend',
    weasley_potter: 'girlfriend',
    shwuggle: null,
  };

  const mappedObject = {
    harry: 'wizard',
    ron: 'friend',
    ginny: 'girlfriend',
    muggle: null,
  };

  const halfObject = { potter: 'wizard' };

  test('should map all fields', () => {
    const dbObject = dbObjectToObject<typeof fullObject, typeof mappedObject>(
      fullObject,
      mapping,
    );
    expect(dbObject).toEqual({
      harry: 'wizard',
      ron: 'friend',
      ginny: 'girlfriend',
      muggle: null,
    });
  });

  test('should map only existing fields', () => {
    const dbObject = dbObjectToObject<typeof fullObject, typeof mappedObject>(
      halfObject,
      mapping,
    );
    expect(dbObject).toEqual({ harry: 'wizard' } as typeof dbObject);
  });

  test('should map empty object to empty object', () => {
    const dbObject = dbObjectToObject<typeof fullObject, typeof mappedObject>(
      {},
      mapping,
    );
    expect(dbObject).toEqual({} as typeof dbObject);
  });
});
