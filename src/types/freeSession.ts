import { Subscription } from './settings';

export interface FreeSession {
  id: string;
  firstName: string;
  lastName: string;
  sessionType: Subscription[];
  enteredAt: string; // date time
  totalPaid: string;
}
