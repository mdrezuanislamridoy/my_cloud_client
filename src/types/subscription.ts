export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId?: string;
  isActive: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodEnd: string;
  plan: SubscriptionPlan;
}

export interface CheckoutSessionResponse {
  sessionId?: string;
  checkoutSessionId?: string;
  url?: string;
  checkoutUrl?: string;
}
