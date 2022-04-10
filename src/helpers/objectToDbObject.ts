function objectToDbObject<T, K>(object: T, mapping: Record<string, string>): K {
  const dbObject: Record<string, unknown> = {};
  Object.keys(mapping).forEach(key => {
    if ((object as Record<string, unknown>)[key] === undefined) return;
    dbObject[mapping[key]] = (object as Record<string, unknown>)[key];
  });
  return dbObject as K;
}

export default objectToDbObject;