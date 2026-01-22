
export interface Merchant {
    id: string;
    name: string;
    slug: string;
    walletAddress: string;
    avatar?: string;
    onChainPolicyId?: number;
    createdAt: string;
    updatedAt: string;
}

export interface MerchantStats {
    totalTipsToday: number;
    totalTipsThisWeek: number;
    totalTipsAllTime: number;
    tipCountTotal: number;
    percentChangeToday: number;
    percentChangeWeek: number;
    activeEmployees: number;
    pendingPayouts: number;
    pendingPayoutsCount: number;
    paidPayouts: number;
    paidPayoutsCount: number;
}

export interface EmployeeWithStats extends Employee {
    pendingAmount: number;
    totalEarned: number;
    lastTxHash?: string;
    lastTxStatus?: string;
}

export interface PayoutRequest {
    merchantId: string;
    employeeId: string;
    amount: number;
}

export interface TipSplitConfig {
    merchantId: string;
    splits: TipSplit[];
}

export interface TipSplit {
    id?: string;
    merchantId?: string;
    name: string;
    percentage: number;
    walletAddress?: string;
    employeeId?: string;
}

export interface Employee {
    id: string;
    merchantId: string;
    name: string;
    walletAddress: string;
    role: string; // e.g., 'FOH', 'BOH', 'Bar'
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export interface TipAllocation {
    id: string;
    transactionId: string;
    merchantId: string;
    employeeId?: string;
    recipientName: string; // Category or employee name
    recipientWallet: string;
    amount: number;
    percentage: number;
    status: 'pending' | 'distributed';
    createdAt: string;
}

export interface TipSession {
    id: string;
    merchantId: string;
    billAmount: number;
    tipAmount?: number;
    tipPercentage?: number;
    totalAmount?: number;
    currency: string;
    status: SessionStatus;
    memo: string;
    payerAddress?: string;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
}

export type SessionStatus =
    | "pending"
    | "tip_selected"
    | "payment_pending"
    | "payment_processing"
    | "confirmed"
    | "failed"
    | "expired";

export interface CreateSessionRequest {
    merchantId: string;
    billAmount: number;
    currency?: string;
}

export interface CreateSessionResponse {
    session: TipSession;
    merchant: Merchant;
}

export interface TipCalculation {
    billAmount: number;
    options: TipOption[];
    roundUp: RoundUpOption;
}

export interface TipOption {
    percentage: number;
    amount: number;
    total: number;
}

export interface RoundUpOption {
    amount: number;
    tipAmount: number;
    total: number;
}

export interface AISuggestion {
    suggestedPercentage: number;
    suggestedAmount: number;
    reasoning?: string;
    confidence: number;
}

export interface AISuggestionRequest {
    billAmount: number;
    merchantId?: string;
    context?: {
        serviceQuality?: "poor" | "average" | "good" | "excellent";
        restaurantType?: string;
        timeOfDay?: string;
        partySize?: number;
    };
}

export interface UpdateTipRequest {
    tipAmount?: number;
    tipPercentage?: number;
    customAmount?: number;
}

// ============================================
// PAYMENT TYPES
// ============================================

export interface PaymentRequirements {
    x402Version: number;
    scheme: string;
    network: string;
    maxAmountRequired: string;
    resource: string;
    description: string;
    mimeType: string;
    payTo: string;
    maxTimeoutSeconds: number;
    asset: string;
    extra?: Record<string, unknown>;
}

export interface PaymentPayload {
    x402Version: number;
    scheme: string;
    network: string;
    payload: {
        signature: string;
        authorization: {
            from: string;
            to: string;
            value: string;
            validAfter: string;
            validBefore: string;
            nonce: string;
        };
    };
}

export interface PreparePaymentRequest {
    sessionId: string;
}

export interface PreparePaymentResponse {
    session: TipSession;
    merchant: Merchant;
    paymentRequirements: PaymentRequirements;
}

export interface VerifyPaymentRequest {
    sessionId: string;
    paymentPayload: string; // Base64 encoded PaymentPayload
}

export interface VerifyPaymentResponse {
    isValid: boolean;
    invalidReason?: string;
}

export interface SettlePaymentRequest {
    sessionId: string;
    paymentPayload: string; // Base64 encoded PaymentPayload
}

export interface SettlePaymentResponse {
    success: boolean;
    txHash?: string;
    networkId?: string;
    error?: string;
}

// ============================================
// TRANSACTION TYPES
// ============================================

export interface Transaction {
    id: string;
    sessionId: string;
    merchantId: string;
    payerAddress: string;
    recipientAddress: string;
    billAmount: number;
    tipAmount: number;
    totalAmount: number;
    currency: string;
    txHash: string;
    networkId: string;
    onChainPolicyId?: number;
    status: TransactionStatus;
    createdAt: string;
    confirmedAt?: string;
}

export type TransactionStatus =
    | "pending"
    | "submitted"
    | "confirmed"
    | "failed";

export interface RecentTip {
    id: string;
    date: string;
    amount: number;
    txHash: string;
    status: TransactionStatus;
    payerAddress?: string;
}

// ============================================
// DISPUTE TYPES
// ============================================

export interface Dispute {
    id: string;
    sessionId: string;
    merchantId: string;
    reason: DisputeReason;
    details: string;
    status: DisputeStatus;
    submittedBy: string;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
    resolution?: string;
}

export type DisputeReason =
    | "incorrect_amount"
    | "unauthorized_transaction"
    | "service_not_received"
    | "duplicate_charge"
    | "other";

export type DisputeStatus =
    | "pending"
    | "under_review"
    | "resolved"
    | "rejected";

export interface CreateDisputeRequest {
    sessionId: string;
    reason: DisputeReason;
    details: string;
    submittedBy: string;
}

// ============================================
// WEBHOOK TYPES
// ============================================

export interface WebhookPayload {
    event: WebhookEvent;
    data: {
        sessionId: string;
        txHash: string;
        amount: number;
        tipAmount: number;
        merchantId: string;
        payerAddress: string;
        timestamp: string;
    };
    signature: string;
}

export type WebhookEvent =
    | "payment.confirmed"
    | "payment.failed"
    | "dispute.created"
    | "dispute.resolved";

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

// ============================================
// EMBED/WIDGET TYPES
// ============================================

export interface EmbedConfig {
    merchantId: string;
    billAmount?: number;
    theme?: "light" | "dark";
    customColor?: string;
    aiSuggestions?: boolean;
}

export interface WidgetSession {
    embedUrl: string;
    sessionId: string;
    expiresAt: string;
}
