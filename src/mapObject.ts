export default function<InputType, OutputType> (daoObject: InputType, mapping: Record<string, string>): OutputType {
  const mappedObject: Record<string, unknown> = {};
  Object.keys(daoObject).forEach(key => {
    const propertyName = mapping[key];
    if (!propertyName) return;
    mappedObject[propertyName] = (daoObject as Record<string, unknown>)[key];
  });
  return mappedObject as OutputType;
}