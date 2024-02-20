function objectToDbObject<ObjectType, DbObjectType>(
  object: Partial<ObjectType>,
  mapping: Record<keyof ObjectType, keyof DbObjectType>,
): DbObjectType {
  const dbObject = {} as DbObjectType;

  Object.keys(mapping).forEach((key) => {
    if (object[key as keyof ObjectType] === undefined) return;

    dbObject[mapping[key as keyof ObjectType]] = object[
      key as keyof ObjectType
    ] as DbObjectType[keyof DbObjectType];
  });

  return dbObject;
}

export default objectToDbObject;
