import dbObjectToObject from 'helpers/dbObjectToObject';

describe('Helper function dbObjectToObject', () => {
  const mapping = {
    harry: 'potter',
    ron: 'weasley',
    ginny: 'weasley_potter',
    muggle: 'shwuggle',
  };

  const fullObject = {
    potter: 'wizard',
    weasley: 'friend',
    weasley_potter: 'girlfriend',
    shwuggle: null,
  }

  const halfObject = { potter: 'wizard' };

  test('should map all fields', () => {
    const dbObject = dbObjectToObject(fullObject, mapping);
    expect(dbObject).toEqual({
      harry: 'wizard',
      ron: 'friend',
      ginny: 'girlfriend',
      muggle: null,
    });
  });


  test('should map only existing fields', () => {
    const dbObject = dbObjectToObject(halfObject, mapping);
    expect(dbObject).toEqual({ harry: 'wizard' });
  });

  test('should map empty object to empty object', () => {
    const dbObject = dbObjectToObject({}, mapping);
    expect(dbObject).toEqual({});
  });
});
