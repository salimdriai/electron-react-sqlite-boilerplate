import { Sex, User } from 'types';

/* eslint-disable import/prefer-default-export */
export const importUsers = (members: any) => {
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
      allTimeEntries: 0,
      bloodType: undefined,
      lastEntryTimestamp: 0,
      notes: '',
    };

    user.id = member.matricule;
    user.firstName = member.prenom.toLocaleLowerCase();
    user.lastName = member.nom.toLocaleLowerCase();
    user.phoneNumber = member.telephone;
    user.birthDate = new Date(member.naissance).toDateString();
    user.sex = member.sexe === 'homme' ? Sex.Male : Sex.Female;
    user.registeredAt = new Date(member.created_at).toDateString();
    user.bloodType = member.sang;

    users.push(user);
  });

  return users;
};
