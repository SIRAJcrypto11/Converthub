export type Currency = 'USD' | 'IDR';

export interface Plan {
    id: string;
    name: string;
    priceUSD: number;
    priceIDR: number;
}

export const PLANS: Plan[] = [
    { id: 'free', name: 'Free', priceUSD: 0, priceIDR: 0 },
    { id: 'pro', name: 'Pro', priceUSD: 9, priceIDR: 150000 },
    { id: 'business', name: 'Business', priceUSD: 49, priceIDR: 750000 },
];

export function getPaymentInstructions(currency: Currency, plan: Plan) {
    if (currency === 'USD') {
        return {
            method: 'PayPal',
            details: 'Send payment to paypal@converthub.com',
            amount: plan.priceUSD,
            currency: 'USD'
        };
    } else {
        return {
            method: 'Manual Bank Transfer',
            details: 'Bank BCA: 1234567890 (A/N ConvertHub)',
            amount: plan.priceIDR,
            currency: 'IDR'
        };
    }
}
