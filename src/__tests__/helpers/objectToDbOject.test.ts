import objectToDbObject from 'helpers/objectToDbObject';

describe('Helper function objectToDbObject', () => {
  const mapping = {
    harry: 'potter',
    ron: 'weasley',
    ginny: 'weasley_potter',
    muggle: 'shwuggle',
  };

  const fullObject = {
    harry: 'wizard',
    ron: 'friend',
    ginny: 'girlfriend',
    muggle: null,
  }

  const halfObject = { harry: 'wizard' };

  test('should map all fields', () => {
    const dbObject = objectToDbObject(fullObject, mapping);
    expect(dbObject).toEqual({
      potter: 'wizard',
      weasley: 'friend',
      weasley_potter: 'girlfriend',
      shwuggle: null,
    });
  });


  test('should map only existing fields', () => {
    const dbObject = objectToDbObject(halfObject, mapping);
    expect(dbObject).toEqual({ potter: 'wizard' });
  });

  test('should map empty object to empty object', () => {
    const dbObject = objectToDbObject({}, mapping);
    expect(dbObject).toEqual({});
  });
});
