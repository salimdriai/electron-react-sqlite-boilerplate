/* eslint-disable import/prefer-default-export */
export const getAge = (birthDate: Date | string) => {
  const bornAt = new Date(birthDate).getTime();
  const now = new Date().getTime();
  const ageTimestamp = now - bornAt;
  const millisecondsInYear = 31557600000;

  const age = ageTimestamp / millisecondsInYear;
  return age.toFixed(0);
};

export function displayFormat(inputString: string) {
  const words = inputString.split(/(?=[A-Z])/);

  const formattedString = words
    .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return formattedString;
}
