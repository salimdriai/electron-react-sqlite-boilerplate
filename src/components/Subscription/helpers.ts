/* eslint-disable import/prefer-default-export */
export function calculateProgress(
  startDate: string | Date | number,
  endDate: string | Date | number
) {
  // Convert all dates to milliseconds since epoch
  const startMs = new Date(startDate).getTime();
  const endMs = new Date(endDate).getTime();
  const currentMs = new Date().getTime();

  // If current date is greater than or equal to end date, return 100%
  if (currentMs >= endMs) {
    return 100;
  }

  if (currentMs < startMs) {
    return 0;
  }

  // Calculate the total duration between start and end dates
  const totalDuration = endMs - startMs;

  // Calculate the duration from start date to current date
  const currentDuration = currentMs - startMs;

  // Calculate the percentage
  const percentage = (currentDuration / totalDuration) * 100;

  return percentage;
}
