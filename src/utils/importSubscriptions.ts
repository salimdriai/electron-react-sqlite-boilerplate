/* eslint-disable import/prefer-default-export */
import { Subscription } from 'types';

const getUserId = (users: any, id: string) => {
  const user = users.find((u: any) => u.id === id);
  if (!user.matricule) {
    throw new Error('Cannot find user id');
  }
  return user?.matricule;
};

export const importSubscriptions = (
  subscriptions: Array<any>,
  users: Array<any>
) => {
  let result: Subscription[] = [];

  subscriptions.forEach((sub) => {
    const userId = getUserId(users, sub.membre);

    const endsAt = new Date(sub.fin).getTime();
    //   if (endsAt < new Date().getTime()) return;

    const payload: Subscription = {
      startedAt: new Date(sub.debut).toDateString(),
      endsAt: new Date(sub.fin).toDateString(),
      paid: Number(sub.versement),
      sessionsAvailable: Number(sub.nbrmois) * 16,
      planId: sub.abonnement,
      sessionsSpent: 0,
      userId,
    };

    const existing = result.find(
      (subscription) => subscription.userId === userId
    );

    if (existing && new Date(existing?.endsAt).getTime() < endsAt) {
      const updatedResults = result.map((subsctiprion) =>
        subsctiprion.userId === existing.userId ? payload : subsctiprion
      );
      result = [...updatedResults];
    } else {
      result.push(payload);
    }
  });

  return result;
};
