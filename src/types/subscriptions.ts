export interface SubscriptionPlan {
  id?: string;
  name: string;
  monthPrice: number;
  sessionPrice: number;
  sessionsPerMonth: number;
}

export interface Subscription {
  id?: string;
  userId: string;
  planId: string;
  startedAt: string;
  endsAt: string;
  paid: number;
  sessionsAvailable: number;
  sessionsSpent: number;
  lastEntryTimestamp?: number;
  lastPaymentId?: string;
}
