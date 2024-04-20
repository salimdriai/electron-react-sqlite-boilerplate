import { FreeSession as IFreeSession } from 'types';
import FreeSessionModel from '../models/FreeSession';

const FreeSession = new FreeSessionModel();

export const getAll = async () => {
  const freeSessions = await FreeSession.get();
  return freeSessions;
};

export const create = async (_: any, session: IFreeSession) => {
  await FreeSession.create(session);
  return session;
};

export const update = async (_: any, session: IFreeSession) => {
  await FreeSession.update(session);
  return session;
};

export const remove = async (_: any, id: string) => {
  await FreeSession.remove(id);
};
