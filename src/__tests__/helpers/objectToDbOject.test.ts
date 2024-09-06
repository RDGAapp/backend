import { describe, expect, test } from 'bun:test';

import objectToDbObject from 'helpers/objectToDbObject';

describe('Helper function objectToDbObject', () => {
  const mapping = {
    harry: 'potter',
    ron: 'weasley',
    ginny: 'weasley_potter',
    muggle: 'shwuggle',
  } as const;

  const fullObject = {
    harry: 'wizard',
    ron: 'friend',
    ginny: 'girlfriend',
    muggle: null,
  };

  const mappedObject = {
    potter: 'wizard',
    weasley: 'friend',
    weasley_potter: 'girlfriend',
    shwuggle: null,
  };

  const halfObject = { harry: 'wizard' };

  test('should map all fields', () => {
    const dbObject = objectToDbObject<typeof fullObject, typeof mappedObject>(
      fullObject,
      mapping,
    );
    expect(dbObject).toEqual({
      potter: 'wizard',
      weasley: 'friend',
      weasley_potter: 'girlfriend',
      shwuggle: null,
    });
  });

  test('should map only existing fields', () => {
    const dbObject = objectToDbObject<typeof fullObject, typeof mappedObject>(
      halfObject,
      mapping,
    );
    expect(dbObject).toEqual({ potter: 'wizard' } as typeof dbObject);
  });

  test('should map empty object to empty object', () => {
    const dbObject = objectToDbObject<typeof fullObject, typeof mappedObject>(
      {},
      mapping,
    );
    expect(dbObject).toEqual({} as typeof dbObject);
  });
});
