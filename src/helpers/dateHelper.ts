export const addDays = (date: Date, number: number) => {
  const newDate = new Date(date.valueOf());
  newDate.setDate(newDate.getDate() + number);
  return newDate;
};
