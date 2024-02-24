/* eslint-disable import/prefer-default-export */
export type StatData = {
  paidAt: string | Date | number;
  amount: number | string;
};

export const getStats = (data: StatData[]) => {
  const currentDate = new Date();
  const firstDayOfLastYear = new Date(currentDate.getFullYear() - 1, 0, 1);
  const lastDayOfLastYear = new Date(currentDate.getFullYear(), 0, 0);
  const firstDayOfCurrentYear = new Date(currentDate.getFullYear(), 0, 1);

  const firstDayOfLastMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );

  const lastDayOfLastMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  );

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const revenueLastMonth = data.reduce((acc, current) => {
    const paymentDate = new Date(current.paidAt);
    if (
      paymentDate >= firstDayOfLastMonth &&
      paymentDate <= lastDayOfLastMonth
    ) {
      return acc + Number(current.amount);
    }
    return acc;
  }, 0);

  // Filter payments made within this month and sum their amounts
  const revenueThisMonth = data.reduce((acc, current) => {
    const paymentDate = new Date(current.paidAt);
    if (paymentDate >= firstDayOfMonth && paymentDate <= lastDayOfMonth) {
      return acc + Number(current.amount);
    }
    return acc;
  }, 0);

  const revenueLastYear = data.reduce((acc, current) => {
    const paymentDate = new Date(current.paidAt);
    if (paymentDate >= firstDayOfLastYear && paymentDate <= lastDayOfLastYear) {
      return acc + Number(current.amount);
    }
    return acc;
  }, 0);

  const revenueThisYear = data.reduce((acc, current) => {
    const paymentDate = new Date(current.paidAt);
    if (paymentDate >= firstDayOfCurrentYear && paymentDate <= currentDate) {
      return acc + Number(current.amount);
    }
    return acc;
  }, 0);

  return {
    revenueLastMonth,
    revenueThisMonth,
    revenueLastYear,
    revenueThisYear,
  };
};
