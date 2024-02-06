export interface FreeSession {
  id?: string;
  firstName?: string;
  lastName?: string;
  plansIds: string; // separated by coma
  enteredAt: string; // date time
  totalPaid: number;
}
