export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPriceCents: number;
  amountCents: number;
  taxRate: number;
  order: number;
}

export interface Invoice {
  id: string;
  number: string;
  status: string;
  amount: number;
  totalCents: number;
  subtotalCents: number;
  taxCents: number;
  amountPaidCents: number;
  amountDueCents: number;
  dueDate: string;
  issueDate: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  notes?: string;
  invoicePdfUrl?: string;
  hostedInvoiceUrl?: string;
  memberId?: string;
  member?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
  };
  items?: InvoiceItem[];
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval?: string;
  popular?: boolean;
  features: string[];
}

export interface Subscription {
  id: string;
  plan: string;
  status: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}
