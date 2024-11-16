/* eslint-disable import/prefer-default-export */
export const getAge = (birthDate: Date | string) => {
  const bornAt = new Date(birthDate).getTime();
  const now = new Date().getTime();
  const ageTimestamp = now - bornAt;
  const millisecondsInYear = 31557600000;

  const age = ageTimestamp / millisecondsInYear;
  return Number(age.toFixed(0)) || 'N/A';
};

export function displayFormat(inputString: string) {
  const words = inputString.split(/(?=[A-Z])/);

  const formattedString = words
    .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return formattedString;
}

export const formatDate = (date: string | Date | number) => {
  const d = new Date(date);
  const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
  const month =
    d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

export const oneMonthFromDate = (date: Date | string) => {
  const oneMonthTimestamp = 30 * 24 * 60 * 60 * 1000;
  const start = new Date(date).getTime();
  return new Date(start + oneMonthTimestamp).toDateString();
};

export const removeZerosFromId = (value: string | number) => {
  return Number(value).toString().toLowerCase() || value;
};

export * from './importPlans';
export * from './importSubscriptions';
export * from './importUsers';
