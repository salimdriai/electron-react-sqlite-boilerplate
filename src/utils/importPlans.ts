import { SubscriptionPlan } from 'types';

/* eslint-disable import/prefer-default-export */
export const importPlans = (plans: any) => {
  const result: SubscriptionPlan[] = [];
  plans.forEach((plan: any) => {
    const payalod: any = {};
    payalod.id = Number(plan.id) as any;
    payalod.name = plan.label;
    payalod.monthPrice = Number(plan.tarif);
    payalod.sessionPrice = 0;
    payalod.sessionsPerMonth = Number(plan.nbrsemaine) * 4;
    result.push(payalod);
  });
  return result;
};
