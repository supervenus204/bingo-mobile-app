import { apiFetch } from '../utils/api-fetch';

export interface PaymentConfirmationRequest {
  challenge_id: string;
  payment_intent_id: string;
}

export interface PaymentConfirmationResponse {
  message: string;
  data: {
    challenge_id: string;
    status: string;
    payment_intent_id: string;
  };
}

export const confirmPayment = async (
  challengeId: string,
  paymentIntentId: string
): Promise<{
  success: boolean;
  data?: PaymentConfirmationResponse;
  error?: string;
}> => {
  try {
    const response = await apiFetch('/api/payment/confirm', 'POST', {
      challenge_id: challengeId,
      payment_intent_id: paymentIntentId,
    });

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to confirm payment',
    };
  }
};
