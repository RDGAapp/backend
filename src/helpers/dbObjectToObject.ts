function dbObjectToObject<DbObjectType, ObjectType>(
  dbObject: Partial<DbObjectType>,
  mapping: Record<keyof ObjectType, keyof DbObjectType>,
): ObjectType {
  const object = {} as ObjectType;

  Object.keys(mapping).forEach((key) => {
    if (dbObject[mapping[key as keyof ObjectType]] === undefined) return;

    object[key as keyof ObjectType] = dbObject[
      mapping[key as keyof ObjectType]
    ] as ObjectType[keyof ObjectType];
  });
  return object;
}

export default dbObjectToObject;
