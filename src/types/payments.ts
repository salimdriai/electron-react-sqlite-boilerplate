export interface Payment {
  id?: string;
  subscriptionId: string;
  userId: string;
  username: string;
  amount: number | null;
  paidAt: string;
  startedAt: string;
  endsAt: string;
}
