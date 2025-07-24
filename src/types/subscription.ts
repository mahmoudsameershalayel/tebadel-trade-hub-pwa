export interface SubscriptionPlan {
  id: number;
  name: string;
  type: "Free" | "Basic" | "Premium";
  pricePer3Monthes: number;
  maxItems: number;
  maxTradeRequests: number;
  hasRealTimeChat: boolean;
}