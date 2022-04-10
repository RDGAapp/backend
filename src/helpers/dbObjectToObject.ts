function dbObjectToObject<T, K>(dbObject: T, mapping: Record<string, string>): K {
  const object: Record<string, unknown> = {};
  Object.keys(mapping).forEach(key => {
    if ((dbObject as Record<string, unknown>)[mapping[key]] === undefined) return;
    object[key] = (dbObject as Record<string, unknown>)[mapping[key]];
  });
  return object as K;
}

export default dbObjectToObject;
