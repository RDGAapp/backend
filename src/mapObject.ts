export default function (daoObject: unknown, mapping: Record<string, string>) {
  if (!daoObject) return;
  const mappedObject = {};
  Object.keys(daoObject).forEach(key => {
    const propertyName = mapping[key];
    if (!propertyName) return;
    mappedObject[propertyName] = daoObject[key];
  });
  return mappedObject;
}