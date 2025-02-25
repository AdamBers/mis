export const isAdult = (date: string) => {
  const age = new Date().getFullYear() - new Date(date).getFullYear();
  return age >= 18;
};
