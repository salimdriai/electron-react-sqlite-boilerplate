export interface Notification {
  id?: string;
  username: string;
  photo: string;
  userId: string;
  planId: string;
  subscriptionId: string;
  message: string;
  createdAt: string;
  isRead: number;
}
