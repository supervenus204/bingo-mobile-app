import { apiFetch } from '../utils';

export interface PromoValidationRequest {
  code: string;
}

export interface PromoValidationResponse {
  message: string;
  data: {
    id: string;
    code: string;
    expiration_date: string;
    usage_limit: number;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface PromoPayRequest {
  challenge_id: string;
  code: string;
}

export interface PromoPayResponse {
  message: string;
  data: {
    challenge_id: string;
    promo_code: string;
    status: string;
  };
}

export const validatePromoCode = async (
  code: string
): Promise<{
  success: boolean;
  data?: PromoValidationResponse;
  error?: string;
}> => {
  try {
    const response = await apiFetch('/api/promo/validate', 'POST', { code });

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to validate promo code',
    };
  }
};

export const payWithPromoCode = async (
  challengeId: string,
  code: string
): Promise<{
  success: boolean;
  data?: PromoPayResponse;
  error?: string;
}> => {
  try {
    const response = await apiFetch('/api/promo/pay', 'POST', {
      challenge_id: challengeId,
      code,
    });

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to process payment with promo code',
    };
  }
};
