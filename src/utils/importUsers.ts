import { Sex, User, UserSubscription, Status } from 'types';

/* eslint-disable import/prefer-default-export */
export const importUsers = ({ members, subscriptions }: any) => {
  const users: User[] = [];
  members.forEach((member: any) => {
    const user: User = {
      id: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      birthDate: '',
      sex: Sex.Male, // Male | Female
      height: 0,
      weight: 0,
      photo: '',
      registeredAt: '',
      allTimeSessions: 0,
      status: Status.Active, // active | expired | new
      bloodType: undefined,
      currentSubscriptions: [],
    };

    user.id = member.matricule;
    user.firstName = member.prenom.toLocaleLowerCase();
    user.lastName = member.nom.toLocaleLowerCase();
    user.phoneNumber = member.telephone;
    user.birthDate = new Date(member.naissance).toDateString();
    user.sex = member.sexe === 'homme' ? Sex.Male : Sex.Female;
    user.registeredAt = new Date(member.created_at).toDateString();
    user.bloodType = member.sang;

    subscriptions.forEach((sub: any) => {
      if (sub.membre === member.id) {
        const subscription: UserSubscription = {
          subscription: sub.abonnement,
          startedAt: new Date(sub.debut).toDateString(),
          endsAt: new Date(sub.fin).toDateString(),
          paid: parseInt(sub.versement),
          sessionsAvailable: parseInt(sub.nbsseance),
          sessionsSpent: parseInt(sub.nbsseance) - parseInt(sub.reste),
          lastEntryTimestamp: undefined,
        };
        if (new Date(subscription.endsAt).getTime() > new Date().getTime()) {
          user.currentSubscriptions.push(subscription);
        }
      }
    });

    if (user.currentSubscriptions.length > 0) {
      const isActive = user.currentSubscriptions.find(
        (sub: any) => new Date(sub.endsAt).getTime() > new Date().getTime()
      );
      user.status = isActive ? Status.Active : Status.Expired;
    } else {
      user.status = Status.New;
    }

    user.currentSubscriptions = JSON.stringify(
      user.currentSubscriptions
    ) as any;

    users.push(user);
  });

  return users;
};
